import { Schema, model, type InferSchemaType } from 'mongoose'

const orderItemSchema = new Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'orders'
    },
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'products'
    },
    product_name_snapshot: {
      type: String,
      required: true
    },
    barcode_snapshot: {
      type: String,
      default: null
    },
    unit_price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    line_total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false
  }
)

export type OrderItemType = InferSchemaType<typeof orderItemSchema>

const OrderItem = model<OrderItemType>('order_items', orderItemSchema)

export default OrderItem
