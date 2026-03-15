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

interface UpdateOrderItemBody {
  product_id: string
  quantity: number
}

interface CheckoutOrderBody {
  payment_method?: PaymentMethod
  payment_status?: PaymentStatus
}

class OrdersService {
  private parseObjectId(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return new Types.ObjectId(value)
  }

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

  private serializeOrder(order: unknown) {
    const doc = order as { toObject?: () => Record<string, unknown> }
    const raw = doc.toObject ? doc.toObject() : (order as Record<string, unknown>)
    const normalizedOrderId = String(raw.order_id ?? raw._id)
    delete raw._id
    delete raw.order_id
    return {
      order_id: normalizedOrderId,
      ...raw
    }
  }

  private serializeOrderItem(item: unknown, normalizedOrderId?: string) {
    const doc = item as { toObject?: () => Record<string, unknown> }
    const raw = doc.toObject ? doc.toObject() : (item as Record<string, unknown>)
    const normalizedOrderItemId = String(raw.order_item_id ?? raw._id)
    const normalizedItemOrderId = normalizedOrderId ?? String(raw.order_id)
    delete raw._id
    delete raw.order_item_id
    return {
      order_item_id: normalizedOrderItemId,
      ...raw,
      order_id: normalizedItemOrderId
    }
  }

  private async findOrderByPublicId(store_id: string, order_id: string) {
    const parsedId = this.parseObjectId(order_id)
    return Order.findOne({
      store_id: new Types.ObjectId(store_id),
      $or: [{ order_id: parsedId }, { _id: parsedId }]
    })
  }

  async getOrders(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    const orders = await Order.find({ store_id: new Types.ObjectId(store_id) })
      .populate('cashier_user_id', 'full_name phone_number role')
      .sort({ createdAt: -1 })
    return orders.map((order) => this.serializeOrder(order))
  }

  async getOrder(user_id: string, order_id: string) {
    const store_id = await this.getStoreId(user_id)
    const order = await this.findOrderByPublicId(store_id, order_id)
    await order?.populate('cashier_user_id', 'full_name phone_number role')

    if (!order) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const normalizedOrder = this.serializeOrder(order)
    const items = await OrderItem.find({ order_id: order._id }).sort({ createdAt: 1 })
    return {
      order: normalizedOrder,
      items: items.map((item) => this.serializeOrderItem(item, normalizedOrder.order_id))
    }
  }

  // Bước 3 Flow 1: Tạo đơn nháp ngay khi nhấn "Bán hàng"
  async createDraftOrder(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    const order = await Order.create({
      store_id: new Types.ObjectId(store_id),
      order_code: this.generateOrderCode(),
      cashier_user_id: new Types.ObjectId(user_id),
      status: OrderStatus.Draft,
      grand_total: 0
    })
    const normalizedOrder = this.serializeOrder(order)
    return { order: normalizedOrder, items: [] }
  }

  // Bước 4 Flow 1: Cập nhật giỏ hàng (thêm/sửa/xóa sản phẩm trong đơn nháp)
  async updateOrderItems(user_id: string, order_id: string, items: UpdateOrderItemBody[]) {
    const store_id = await this.getStoreId(user_id)
    const order = await this.findOrderByPublicId(store_id, order_id)

    if (!order) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (order.status !== OrderStatus.Draft) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_MUST_BE_DRAFT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const productIds = [...new Set(items.map((item) => item.product_id))]
    const parsedProductIds = productIds.filter((id) => Types.ObjectId.isValid(id)).map((id) => new Types.ObjectId(id))
    const products = await Product.find({
      store_id: new Types.ObjectId(store_id),
      $or: [{ _id: { $in: parsedProductIds } }, { product_id: { $in: parsedProductIds } }]
    }).select('_id product_id name barcode price track_inventory')

    if (products.length !== productIds.length) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const productMap = new Map<string, (typeof products)[number]>()
    for (const product of products) {
      productMap.set(product._id.toString(), product)
      if ((product as any).product_id) {
        productMap.set(String((product as any).product_id), product)
      }
    }
    let grand_total = 0
    const orderItemsPayload = items.map((item) => {
      const product = productMap.get(item.product_id)!
      const line_total = product.price * item.quantity
      grand_total += line_total
      return {
        order_id: order._id,
        product_id: product._id,
        product_name_snapshot: product.name,
        barcode_snapshot: product.barcode ?? null,
        unit_price: product.price,
        quantity: item.quantity,
        line_total
      }
    })

    await OrderItem.deleteMany({ order_id: order._id })
    await OrderItem.insertMany(orderItemsPayload)

    order.grand_total = grand_total
    await order.save()

    const updatedItems = await OrderItem.find({ order_id: order._id }).sort({ createdAt: 1 })
    const normalizedOrder = this.serializeOrder(order)
    return {
      order: normalizedOrder,
      items: updatedItems.map((item) => this.serializeOrderItem(item, normalizedOrder.order_id))
    }
  }

  // Bước 4 Flow 1: Chốt đơn & Thanh toán → trừ tồn kho
  async checkoutOrder(user_id: string, order_id: string, payload: CheckoutOrderBody) {
    const store_id = await this.getStoreId(user_id)
    const order = await this.findOrderByPublicId(store_id, order_id)

    if (!order) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (order.status !== OrderStatus.Draft) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_MUST_BE_DRAFT,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    const items = await OrderItem.find({ order_id: order._id })
    if (items.length === 0) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_HAS_NO_ITEMS,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    // Batch-fetch products để kiểm tra tồn kho
    const productIds = items.map((item) => item.product_id)
    const products = await Product.find({ _id: { $in: productIds } }).select('_id track_inventory')
    const productMap = new Map(products.map((p) => [p._id.toString(), p]))

    for (const item of items) {
      const product = productMap.get(item.product_id.toString())
      if (product?.track_inventory) {
        const stock = await InventoryStock.findOne({
          store_id: new Types.ObjectId(store_id),
          product_id: item.product_id
        }).select('on_hand')
        if (!stock || stock.on_hand < item.quantity) {
          throw new ErrorWithStatus({
            message: INVENTORY_MESSAGES.INSUFFICIENT_STOCK,
            status: HTTP_STATUS.BAD_REQUEST
          })
        }
      }
    }

    order.status = OrderStatus.Completed
    order.payment_method = payload.payment_method ?? PaymentMethod.Cash
    order.payment_status = payload.payment_status ?? PaymentStatus.Paid
    order.completed_at = new Date()
    await order.save()

    for (const item of items) {
      const product = productMap.get(item.product_id.toString())
      if (product?.track_inventory) {
        await inventoryService.decreaseStock(item.product_id.toString(), store_id, item.quantity)
      }
    }

    const normalizedOrder = this.serializeOrder(order)
    return {
      order: normalizedOrder,
      items: items.map((item) => this.serializeOrderItem(item, normalizedOrder.order_id))
    }
  }

  // Flow 2: Hủy đơn nháp
  async cancelOrder(user_id: string, order_id: string) {
    const store_id = await this.getStoreId(user_id)
    const order = await this.findOrderByPublicId(store_id, order_id)

    if (!order) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_ALREADY_CANCELLED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    if (order.status === OrderStatus.Completed) {
      throw new ErrorWithStatus({
        message: ORDERS_MESSAGES.ORDER_ALREADY_COMPLETED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }

    order.status = OrderStatus.Cancelled
    order.cancelled_at = new Date()
    await order.save()

    return this.serializeOrder(order)
  }
}

const ordersService = new OrdersService()
export default ordersService
