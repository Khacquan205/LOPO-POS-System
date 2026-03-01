import { Schema, model, type InferSchemaType } from 'mongoose'
import { UserRole } from '~/constants/enum.js'

const userSchema = new Schema(
  {
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
