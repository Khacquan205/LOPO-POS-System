import dotenv from 'dotenv'
import { connect, disconnect } from 'mongoose'
import Store from '~/models/schemas/Store.schema.js'

dotenv.config()

const mongodbUri = process.env.MONGODB_URI
if (!mongodbUri) {
  throw new Error('Missing required environment variable: MONGODB_URI')
}
const requiredMongoUri = mongodbUri

async function run() {
  await connect(requiredMongoUri)

  const stores = await Store.find({
    $or: [{ qr_code: { $exists: false } }, { qr_code: null }, { qr_code: '' }]
  }).select('_id store_id qr_code')

  let updatedCount = 0
  for (const store of stores) {
    const normalizedStoreId = String((store as any).store_id ?? store._id)
    await Store.updateOne(
      { _id: store._id },
      {
        $set: {
          qr_code: normalizedStoreId
        }
      }
    )
    updatedCount += 1
  }

  await Store.updateMany({ join_requests: { $exists: false } }, { $set: { join_requests: [] } })

  console.log(`Backfill completed. Updated stores: ${updatedCount}`)
}

run()
  .catch((error) => {
    console.error('Backfill failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await disconnect()
  })
