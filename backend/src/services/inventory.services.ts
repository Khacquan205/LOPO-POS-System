import { Types } from 'mongoose'
import InventoryStock from '~/models/schemas/InventoryStock.schema.js'
import Product from '~/models/schemas/Product.schema.js'
import User from '~/models/schemas/User.schema.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { INVENTORY_MESSAGES } from '~/constants/messages.js'

class InventoryService {
  private parseObjectId(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.PRODUCT_NOT_BELONG_TO_STORE,
        status: HTTP_STATUS.BAD_REQUEST
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

  private async findProductByPublicId(product_id: string, store_id: string) {
    const parsedId = this.parseObjectId(product_id)
    return Product.findOne({
      store_id: new Types.ObjectId(store_id),
      $or: [{ product_id: parsedId }, { _id: parsedId }]
    }).select('_id')
  }

  private async validateProductBelongsToStore(product_id: string, store_id: string): Promise<void> {
    const product = await this.findProductByPublicId(product_id, store_id)
    if (!product) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.PRODUCT_NOT_BELONG_TO_STORE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  async getStocks(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    return InventoryStock.find({ store_id: new Types.ObjectId(store_id) })
      .populate('product_id', 'product_id name barcode price is_active category_id')
      .sort({ createdAt: -1 })
  }

  async getStock(user_id: string, product_id: string) {
    const store_id = await this.getStoreId(user_id)
    const product = await this.findProductByPublicId(product_id, store_id)
    if (!product) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.PRODUCT_NOT_BELONG_TO_STORE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const stock = await InventoryStock.findOne({
      product_id: product._id,
      store_id: new Types.ObjectId(store_id)
    }).populate('product_id', 'product_id name barcode price is_active category_id')
    if (!stock) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.STOCK_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return stock
  }

  // Set số lượng tồn kho trực tiếp (upsert)
  async updateStock(user_id: string, product_id: string, on_hand: number) {
    const store_id = await this.getStoreId(user_id)
    const product = await this.findProductByPublicId(product_id, store_id)
    if (!product) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.PRODUCT_NOT_BELONG_TO_STORE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    return InventoryStock.findOneAndUpdate(
      { product_id: product._id, store_id: new Types.ObjectId(store_id) },
      { $set: { on_hand } },
      { new: true, upsert: true }
    )
  }

  // Gọi nội bộ khi tạo đơn hàng — trừ số lượng
  async decreaseStock(product_id: string, store_id: string, quantity: number) {
    const stock = await InventoryStock.findOne({
      product_id: new Types.ObjectId(product_id),
      store_id: new Types.ObjectId(store_id)
    })
    if (!stock || stock.on_hand < quantity) {
      throw new ErrorWithStatus({
        message: INVENTORY_MESSAGES.INSUFFICIENT_STOCK,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    stock.on_hand -= quantity
    await stock.save()
    return stock
  }
}

const inventoryService = new InventoryService()
export default inventoryService
