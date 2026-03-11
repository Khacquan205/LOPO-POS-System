import { Schema, Types, model, type InferSchemaType } from 'mongoose'

const categorySchema = new Schema(
  {
    category_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      default: () => new Types.ObjectId()
    },
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'stores'
    },
    name: {
      type: String,
      required: true,
      trim: true
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

export type CategoryType = InferSchemaType<typeof categorySchema>

const Category = model<CategoryType>('categories', categorySchema)

export default Category
