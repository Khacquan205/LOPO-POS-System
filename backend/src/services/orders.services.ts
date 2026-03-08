import { Types } from 'mongoose'
import Order from '~/models/schemas/Order.schema.js'
import OrderItem from '~/models/schemas/OrderItem.schema.js'
import Product from '~/models/schemas/Product.schema.js'
import InventoryStock from '~/models/schemas/InventoryStock.schema.js'
import User from '~/models/schemas/User.schema.js'
import inventoryService from '~/services/inventory.services.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { ORDERS_MESSAGES, INVENTORY_MESSAGES } from '~/constants/messages.js'
import { OrderStatus, PaymentMethod, PaymentStatus } from '~/constants/enum.js'

interface CreateOrderItemBody {
  product_id: string
  quantity: number
}

interface CreateOrderBody {
  items: CreateOrderItemBody[]
  note?: string
  payment_method?: PaymentMethod
  payment_status?: PaymentStatus
}

class OrdersService {
  private async getStoreId(user_id: string): Promise<string> {
    const user = await User.findById(user_id).select('store_id')
    if (!user?.store_id) {
      throw new ErrorWithStatus({
        message: 'Tài khoản chưa được liên kết với cửa hàng',
        status: HTTP_STATUS.FORBIDDEN
      })
    }
    return user.store_id.toString()
  }

  private generateOrderCode(): string {
    const time = Date.now().toString().slice(-8)
    const rand = Math.floor(1000 + Math.random() * 9000)
    return `OD${time}${rand}`
  }

  async getOrders(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    return Order.find({ store_id: new Types.ObjectId(store_id) })
      .populate('cashier_user_id', 'full_name phone_number role')
      .sort({ createdAt: -1 })
  }

  async getOrder(user_id: string, order_id: string) {
    const store_id = await this.getStoreId(user_id)
    const order = await Order.findOne({
      _id: new Types.ObjectId(order_id),
      store_id: new Types.ObjectId(store_id)
    }).populate('cashier_user_id', 'full_name phone_number role')

    if (!order) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const items = await OrderItem.find({ order_id: order._id }).sort({ createdAt: 1 })
    return { order, items }
  }

  async createOrder(user_id: string, payload: CreateOrderBody) {
    const store_id = await this.getStoreId(user_id)
    const productIds = [...new Set(payload.items.map((item) => item.product_id))]

    const products = await Product.find({
      _id: { $in: productIds.map((id) => new Types.ObjectId(id)) },
      store_id: new Types.ObjectId(store_id)
    }).select('_id name barcode price track_inventory')

    if (products.length !== productIds.length) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const productMap = new Map(products.map((product) => [product._id.toString(), product]))

    // Pre-check tồn kho trước khi tạo đơn
    for (const item of payload.items) {
      const product = productMap.get(item.product_id)
      if (!product) {
        throw new ErrorWithStatus({
          message: ORDERS_MESSAGES.PRODUCT_NOT_FOUND,
          status: HTTP_STATUS.BAD_REQUEST
        })
      }
      if (product.track_inventory) {
        const stock = await InventoryStock.findOne({
          store_id: new Types.ObjectId(store_id),
          product_id: product._id
        }).select('on_hand')
        if (!stock || stock.on_hand < item.quantity) {
          throw new ErrorWithStatus({
            message: INVENTORY_MESSAGES.INSUFFICIENT_STOCK,
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
      }
    }

    let grand_total = 0
    const orderItemsPayload = payload.items.map((item) => {
      const product = productMap.get(item.product_id)!
      const line_total = product.price * item.quantity
      grand_total += line_total
      return {
        product_id: product._id,
        product_name_snapshot: product.name,
        barcode_snapshot: product.barcode ?? null,
        unit_price: product.price,
        quantity: item.quantity,
        line_total
      }
    })

    const order = await Order.create({
      store_id: new Types.ObjectId(store_id),
      order_code: this.generateOrderCode(),
      cashier_user_id: new Types.ObjectId(user_id),
      status: OrderStatus.Completed,
      payment_method: payload.payment_method ?? PaymentMethod.Cash,
      payment_status: payload.payment_status ?? PaymentStatus.Paid,
      grand_total,
      note: payload.note ?? null,
      completed_at: new Date()
    })

    await OrderItem.insertMany(
      orderItemsPayload.map((item) => ({
        order_id: order._id,
        ...item
      }))
    )

    for (const item of payload.items) {
      const product = productMap.get(item.product_id)!
      if (product.track_inventory) {
        await inventoryService.decreaseStock(product._id.toString(), store_id, item.quantity)
      }
    }

    const items = await OrderItem.find({ order_id: order._id }).sort({ createdAt: 1 })
    return { order, items }
  }
}

const ordersService = new OrdersService()
export default ordersService
