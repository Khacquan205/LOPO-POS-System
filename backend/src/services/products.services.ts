import { Types } from 'mongoose'
import Product from '~/models/schemas/Product.schema.js'
import Category from '~/models/schemas/Category.schema.js'
import User from '~/models/schemas/User.schema.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { PRODUCTS_MESSAGES } from '~/constants/messages.js'

interface CreateProductBody {
  name: string
  price: number
  category_id?: string | null
  barcode?: string
  image_url?: string
  track_inventory?: boolean
  is_active?: boolean
}

interface UpdateProductBody {
  name?: string
  price?: number
  category_id?: string | null
  barcode?: string
  image_url?: string
  track_inventory?: boolean
  is_active?: boolean
}

class ProductsService {
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

  private async validateCategoryBelongsToStore(category_id: string, store_id: string): Promise<void> {
    const category = await Category.findOne({
      _id: new Types.ObjectId(category_id),
      store_id: new Types.ObjectId(store_id)
    }).select('_id')
    if (!category) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.CATEGORY_NOT_BELONG_TO_STORE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  async getProducts(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    return Product.find({ store_id: new Types.ObjectId(store_id) }).sort({ createdAt: -1 })
  }

  async getProduct(user_id: string, product_id: string) {
    const store_id = await this.getStoreId(user_id)
    const product = await Product.findOne({
      _id: new Types.ObjectId(product_id),
      store_id: new Types.ObjectId(store_id)
    })
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return product
  }

  async createProduct(user_id: string, payload: CreateProductBody) {
    const store_id = await this.getStoreId(user_id)
    if (payload.category_id) {
      await this.validateCategoryBelongsToStore(payload.category_id, store_id)
    }
    return Product.create({
      store_id: new Types.ObjectId(store_id),
      category_id: payload.category_id ? new Types.ObjectId(payload.category_id) : null,
      name: payload.name,
      price: payload.price,
      barcode: payload.barcode ?? null,
      image_url: payload.image_url ?? null,
      track_inventory: payload.track_inventory ?? false,
      is_active: payload.is_active ?? true
    })
  }

  async updateProduct(user_id: string, product_id: string, payload: UpdateProductBody) {
    const store_id = await this.getStoreId(user_id)
    if (payload.category_id) {
      await this.validateCategoryBelongsToStore(payload.category_id, store_id)
    }
    const updateData: Record<string, unknown> = { ...payload }
    if (payload.category_id !== undefined) {
      updateData.category_id = payload.category_id ? new Types.ObjectId(payload.category_id) : null
    }
    const product = await Product.findOneAndUpdate(
      { _id: new Types.ObjectId(product_id), store_id: new Types.ObjectId(store_id) },
      { $set: updateData },
      { new: true }
    )
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return product
  }

  async deleteProduct(user_id: string, product_id: string) {
    const store_id = await this.getStoreId(user_id)
    const product = await Product.findOneAndDelete({
      _id: new Types.ObjectId(product_id),
      store_id: new Types.ObjectId(store_id)
    })
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
}

const productsService = new ProductsService()
export default productsService
