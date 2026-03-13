import { Schema, Types, model, type InferSchemaType } from 'mongoose'
import { OrderStatus, PaymentMethod, PaymentStatus } from '~/constants/enum.js'

const orderSchema = new Schema(
  {
    order_id: {
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
    order_code: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    cashier_user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    customer_id: {
      type: Schema.Types.ObjectId,
      ref: 'customers',
      default: null
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Draft
    },
    payment_method: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.Cash
    },
    payment_status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Paid
    },
    grand_total: {
      type: Number,
      default: 0,
      min: 0
    },
    note: {
      type: String,
      default: null
    },
    completed_at: {
      type: Date,
      default: null
    },
    cancelled_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type OrderType = InferSchemaType<typeof orderSchema>

const Order = model<OrderType>('orders', orderSchema)

export default Order
