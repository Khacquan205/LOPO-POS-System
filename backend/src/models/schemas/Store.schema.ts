import { Schema, Types, model, type InferSchemaType } from 'mongoose'
import { JoinRequestStatus } from '~/constants/enum.js'

const joinRequestSchema = new Schema(
  {
    request_id: {
      type: Schema.Types.ObjectId,
      required: true,
      default: () => new Types.ObjectId()
    },
    staff_user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    status: {
      type: String,
      enum: Object.values(JoinRequestStatus),
      default: JoinRequestStatus.Pending
    },
    requested_at: {
      type: Date,
      default: () => new Date()
    },
    reviewed_at: {
      type: Date,
      default: null
    },
    reviewed_by: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      default: null
    }
  },
  {
    _id: false,
    versionKey: false
  }
)

const storeSchema = new Schema(
  {
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      default: () => new Types.ObjectId()
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    owner_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    qr_code: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    join_requests: {
      type: [joinRequestSchema],
      default: []
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
