import { Schema, model, type InferSchemaType } from 'mongoose'

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type StoreType = InferSchemaType<typeof storeSchema>

const Store = model<StoreType>('stores', storeSchema)

export default Store
