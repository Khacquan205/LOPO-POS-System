import { Schema, model, type InferSchemaType } from 'mongoose'
import { PaymentMethod, PaymentStatus } from '~/constants/enum.js'

const paymentSchema = new Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'orders'
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending
    },
    transaction_ref: {
      type: String,
      default: null
    },
    paid_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type PaymentType = InferSchemaType<typeof paymentSchema>

const Payment = model<PaymentType>('payments', paymentSchema)

export default Payment
