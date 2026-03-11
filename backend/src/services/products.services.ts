import { Types } from 'mongoose'
import Product from '~/models/schemas/Product.schema.js'
import Category from '~/models/schemas/Category.schema.js'
import InventoryStock from '~/models/schemas/InventoryStock.schema.js'
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
  on_hand?: number
  is_active?: boolean
}

interface UpdateProductBody {
  name?: string
  price?: number
  category_id?: string | null
  barcode?: string
  image_url?: string
  track_inventory?: boolean
  on_hand?: number
  is_active?: boolean
}

class ProductsService {
  private parseObjectId(value: string, notFoundMessage: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new ErrorWithStatus({
        message: notFoundMessage,
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

  private serializeProduct(product: unknown) {
    const doc = product as { toObject?: () => Record<string, unknown> }
    const raw = doc.toObject ? doc.toObject() : (product as Record<string, unknown>)
    const normalizedProductId = String(raw.product_id ?? raw._id)
    delete raw._id
    delete raw.product_id
    delete raw.createdAt
    delete raw.updatedAt
    delete raw.sku
    delete raw.cost_price
    // Normalize category_id: nếu đã populate (object), lấy custom category_id
    if (raw.category_id && typeof raw.category_id === 'object') {
      const cat = raw.category_id as Record<string, unknown>
      raw.category_id = String(cat.category_id ?? cat._id)
    }
    return {
      product_id: normalizedProductId,
      ...raw
    }
  }

  private async findProductByPublicId(store_id: string, product_id: string) {
    const parsedId = this.parseObjectId(product_id, PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND)
    return Product.findOne({
      store_id: new Types.ObjectId(store_id),
      $or: [{ product_id: parsedId }, { _id: parsedId }]
    }).populate('category_id', 'category_id')
  }

  private async findCategoryByPublicId(store_id: string, category_id: string) {
    const parsedId = this.parseObjectId(category_id, PRODUCTS_MESSAGES.CATEGORY_NOT_BELONG_TO_STORE)
    return Category.findOne({
      store_id: new Types.ObjectId(store_id),
      $or: [{ category_id: parsedId }, { _id: parsedId }]
    }).select('_id')
  }

  private async validateCategoryBelongsToStore(category_id: string, store_id: string): Promise<void> {
    const category = await this.findCategoryByPublicId(store_id, category_id)
    if (!category) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.CATEGORY_NOT_BELONG_TO_STORE,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
  }

  async getProducts(user_id: string) {
    const store_id = await this.getStoreId(user_id)
    const products = await Product.find({ store_id: new Types.ObjectId(store_id) })
      .populate('category_id', 'category_id')
      .sort({ createdAt: -1 })
    const productIds = products.map((product) => product._id)
    const stocks = await InventoryStock.find({
      store_id: new Types.ObjectId(store_id),
      product_id: { $in: productIds }
    })
      .select('product_id on_hand')
      .lean()

    const onHandByProductId = new Map<string, number>()
    stocks.forEach((stock) => {
      onHandByProductId.set(String(stock.product_id), stock.on_hand)
    })

    return products.map((product) => ({
      ...this.serializeProduct(product),
      on_hand: onHandByProductId.get(String(product._id)) ?? 0
    }))
  }

  async lookupByBarcode(user_id: string, barcode: string) {
    const store_id = await this.getStoreId(user_id)
    const product = await Product.findOne({
      store_id: new Types.ObjectId(store_id),
      barcode,
      is_active: true
    }).populate('category_id', 'category_id')
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND_BY_BARCODE,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const stock = await InventoryStock.findOne({
      store_id: new Types.ObjectId(store_id),
      product_id: product._id
    })
      .select('on_hand')
      .lean()

    return {
      ...this.serializeProduct(product),
      on_hand: stock?.on_hand ?? 0
    }
  }

  async getProduct(user_id: string, product_id: string) {
    const store_id = await this.getStoreId(user_id)
    const product = await this.findProductByPublicId(store_id, product_id)
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    const stock = await InventoryStock.findOne({
      store_id: new Types.ObjectId(store_id),
      product_id: product._id
    })
      .select('on_hand')
      .lean()

    return {
      ...this.serializeProduct(product),
      on_hand: stock?.on_hand ?? 0
    }
  }

  async createProduct(user_id: string, payload: CreateProductBody) {
    const store_id = await this.getStoreId(user_id)
    let categoryObjectId: Types.ObjectId | null = null
    if (payload.category_id) {
      await this.validateCategoryBelongsToStore(payload.category_id, store_id)
      const category = await this.findCategoryByPublicId(store_id, payload.category_id)
      categoryObjectId = category?._id ?? null
    }
    const trackInventory = payload.track_inventory ?? false
    const product = await Product.create({
      store_id: new Types.ObjectId(store_id),
      category_id: categoryObjectId,
      name: payload.name,
      price: payload.price,
      barcode: payload.barcode ?? null,
      image_url: payload.image_url ?? null,
      track_inventory: trackInventory,
      is_active: payload.is_active ?? true
    })

    let onHand = 0

    if (trackInventory) {
      onHand = Number(payload.on_hand ?? 0)
      await InventoryStock.findOneAndUpdate(
        {
          product_id: product._id,
          store_id: new Types.ObjectId(store_id)
        },
        {
          $set: {
            on_hand: onHand
          }
        },
        {
          new: true,
          upsert: true
        }
      )
    }

    await product.populate('category_id', 'category_id')

    return {
      ...this.serializeProduct(product),
      on_hand: onHand
    }
  }

  async updateProduct(user_id: string, product_id: string, payload: UpdateProductBody) {
    const store_id = await this.getStoreId(user_id)
    const product = await this.findProductByPublicId(store_id, product_id)
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    if (payload.category_id) {
      await this.validateCategoryBelongsToStore(payload.category_id, store_id)
    }

    const nextTrackInventory = payload.track_inventory ?? product.track_inventory
    const hasOnHand = payload.on_hand !== undefined
    const requestedOnHand = Number(payload.on_hand ?? 0)

    if (!nextTrackInventory && hasOnHand && requestedOnHand > 0) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.ON_HAND_REQUIRES_TRACK_INVENTORY,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    const updateData: Record<string, unknown> = { ...payload }
    delete updateData.on_hand

    if (payload.category_id !== undefined) {
      if (payload.category_id) {
        const category = await this.findCategoryByPublicId(store_id, payload.category_id)
        updateData.category_id = category?._id ?? null
      } else {
        updateData.category_id = null
      }
    }

    Object.assign(product, updateData)
    await product.save()
    await product.populate('category_id', 'category_id')

    if (nextTrackInventory) {
      if (hasOnHand) {
        await InventoryStock.findOneAndUpdate(
          {
            product_id: product._id,
            store_id: new Types.ObjectId(store_id)
          },
          {
            $set: {
              on_hand: requestedOnHand
            }
          },
          {
            new: true,
            upsert: true
          }
        )
      }
    } else if (hasOnHand) {
      await InventoryStock.findOneAndUpdate(
        {
          product_id: product._id,
          store_id: new Types.ObjectId(store_id)
        },
        {
          $set: {
            on_hand: 0
          }
        },
        {
          new: true,
          upsert: true
        }
      )
    }

    const stock = await InventoryStock.findOne({
      store_id: new Types.ObjectId(store_id),
      product_id: product._id
    })
      .select('on_hand')
      .lean()

    return {
      ...this.serializeProduct(product),
      on_hand: stock?.on_hand ?? 0
    }
  }

  async deleteProduct(user_id: string, product_id: string) {
    const store_id = await this.getStoreId(user_id)
    const product = await this.findProductByPublicId(store_id, product_id)
    if (!product) {
      throw new ErrorWithStatus({
        message: PRODUCTS_MESSAGES.PRODUCT_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    await product.deleteOne()
  }
}

const productsService = new ProductsService()
export default productsService
