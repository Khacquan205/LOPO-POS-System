import { Schema, Types, model, type InferSchemaType } from 'mongoose'

const inventoryStockSchema = new Schema(
  {
    inventory_stock_id: {
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
    product_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'products',
      unique: true
    },
    on_hand: {
      type: Number,
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
