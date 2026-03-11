import { Types } from 'mongoose'
import Category from '~/models/schemas/Category.schema.js'
import User from '~/models/schemas/User.schema.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { CATEGORIES_MESSAGES } from '~/constants/messages.js'

interface CreateCategoryBody {
  name: string
  is_active?: boolean
}

interface UpdateCategoryBody {
  name?: string
  is_active?: boolean
}

class CategoriesService {
  private parseObjectId(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND,
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

  private serializeCategory(category: unknown) {
    const doc = category as { toObject?: () => Record<string, unknown> }
    const raw = doc.toObject ? doc.toObject() : (category as Record<string, unknown>)
    const normalizedCategoryId = String(raw.category_id ?? raw._id)
    delete raw._id
    delete raw.category_id
    delete raw.createdAt
    delete raw.updatedAt
    delete raw.sort_order
    return {
      category_id: normalizedCategoryId,
      ...raw
    }
  }

  private async findCategoryByPublicId(store_id: string, category_id: string) {
    const parsedId = this.parseObjectId(category_id)
    return Category.findOne({
      store_id: new Types.ObjectId(store_id),
      $or: [{ category_id: parsedId }, { _id: parsedId }]
    })
  }

  async getCategories(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    const categories = await Category.find({ store_id: new Types.ObjectId(store_id) }).sort({ createdAt: 1 })
    return categories.map((category) => this.serializeCategory(category))
  }

  async getCategory(user_id: string, category_id: string) {
    const store_id = await this.getStoreId(user_id)
    const category = await this.findCategoryByPublicId(store_id, category_id)
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return this.serializeCategory(category)
  }

  async createCategory(user_id: string, payload: CreateCategoryBody) {
    const store_id = await this.getStoreId(user_id)
    const category = await Category.create({
      store_id: new Types.ObjectId(store_id),
      name: payload.name,
      is_active: payload.is_active ?? true
    })
    return this.serializeCategory(category)
  }

  async updateCategory(user_id: string, category_id: string, payload: UpdateCategoryBody) {
    const store_id = await this.getStoreId(user_id)
    const category = await this.findCategoryByPublicId(store_id, category_id)
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    Object.assign(category, payload)
    await category.save()
    return this.serializeCategory(category)
  }

  async deleteCategory(user_id: string, category_id: string) {
    const store_id = await this.getStoreId(user_id)
    const category = await this.findCategoryByPublicId(store_id, category_id)
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    await category.deleteOne()
  }
}

const categoriesService = new CategoriesService()
export default categoriesService
