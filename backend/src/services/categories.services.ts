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

  async getCategories(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    return Category.find({ store_id: new Types.ObjectId(store_id) }).sort({ createdAt: 1 })
  }

  async createCategory(user_id: string, payload: CreateCategoryBody) {
    const store_id = await this.getStoreId(user_id)
    return Category.create({
      store_id: new Types.ObjectId(store_id),
      name: payload.name,
      is_active: payload.is_active ?? true
    })
  }

  async updateCategory(user_id: string, category_id: string, payload: UpdateCategoryBody) {
    const store_id = await this.getStoreId(user_id)
    const category = await Category.findOneAndUpdate(
      { _id: new Types.ObjectId(category_id), store_id: new Types.ObjectId(store_id) },
      { $set: payload },
      { new: true }
    )
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return category
  }

  async deleteCategory(user_id: string, category_id: string) {
    const store_id = await this.getStoreId(user_id)
    const category = await Category.findOneAndDelete({
      _id: new Types.ObjectId(category_id),
      store_id: new Types.ObjectId(store_id)
    })
    if (!category) {
      throw new ErrorWithStatus({
        message: CATEGORIES_MESSAGES.CATEGORY_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
  }
}

const categoriesService = new CategoriesService()
export default categoriesService
