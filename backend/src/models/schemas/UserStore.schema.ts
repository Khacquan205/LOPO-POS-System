import { Schema, Types, model, type InferSchemaType } from 'mongoose'
import { UserRole } from '~/constants/enum.js'

const userStoreSchema = new Schema(
  {
    user_store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      default: () => new Types.ObjectId()
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'stores'
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true
    },
    joined_at: {
      type: Date,
      default: () => new Date()
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

userStoreSchema.index({ user_id: 1, store_id: 1 }, { unique: true })

export type UserStoreType = InferSchemaType<typeof userStoreSchema>

const UserStore = model<UserStoreType>('user_stores', userStoreSchema)

export default UserStore
