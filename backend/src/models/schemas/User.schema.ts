import { Schema, Types, model, type InferSchemaType } from 'mongoose'
import { UserRole, UserStatus } from '~/constants/enum.js'

const userSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      default: () => new Types.ObjectId()
    },
    full_name: {
      type: String,
      required: true,
      trim: true
    },
    phone_number: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.Staff
    },
    store_id: {
      type: Schema.Types.ObjectId,
      ref: 'stores',
      default: null
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.Active
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type UserType = InferSchemaType<typeof userSchema>

const User = model<UserType>('users', userSchema)

export default User
