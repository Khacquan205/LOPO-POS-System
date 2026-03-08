import { Schema, model, type InferSchemaType } from 'mongoose'

const inventoryStockSchema = new Schema(
  {
    store_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'stores'
    },
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'products'
    },
    on_hand: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type InventoryStockType = InferSchemaType<typeof inventoryStockSchema>

const InventoryStock = model<InventoryStockType>('inventory_stocks', inventoryStockSchema)

export default InventoryStock
