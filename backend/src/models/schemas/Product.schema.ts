import { Schema, model, type InferSchemaType } from 'mongoose'

const productSchema = new Schema(
  {
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'stores'
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: 'categories',
      default: null
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    barcode: {
      type: String,
      trim: true,
      default: null
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image_url: {
      type: String,
      default: null
    },
    track_inventory: {
      type: Boolean,
      default: false
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type ProductType = InferSchemaType<typeof productSchema>

const Product = model<ProductType>('products', productSchema)

export default Product
