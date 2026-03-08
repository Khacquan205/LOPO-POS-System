import mongoose from 'mongoose'
import { connectDB } from '~/config/index.js'
import Category from '~/models/schemas/Category.schema.js'
import User from '~/models/schemas/User.schema.js'

type SeedCategory = {
  name: string
  is_active: boolean
}

const SAMPLE_CATEGORIES: SeedCategory[] = [
  { name: 'Do uong', is_active: true },
  { name: 'Do an nhanh', is_active: true },
  { name: 'Do dong lanh', is_active: true },
  { name: 'Rau cu qua', is_active: true },
  { name: 'Thit ca hai san', is_active: true },
  { name: 'Banh keo', is_active: true },
  { name: 'Hoa my pham', is_active: true },
  { name: 'Do gia dung', is_active: true },
  { name: 'Van phong pham', is_active: true },
  { name: 'Khac', is_active: true }
]

const getArgValue = (args: string[], key: string): string | undefined => {
  const withEquals = args.find((arg) => arg.startsWith(`${key}=`))
  if (withEquals) {
    return withEquals.split('=').slice(1).join('=').trim()
  }
  const keyIndex = args.findIndex((arg) => arg === key)
  if (keyIndex >= 0) {
    return args[keyIndex + 1]?.trim()
  }
  return undefined
}

const run = async () => {
  const args = process.argv.slice(2)
  const phone = getArgValue(args, '--phone')
  const shouldReplace = args.includes('--replace')

  if (!phone) {
    console.error('Missing required argument: --phone')
    console.error('Example: npm run seed:categories -- --phone=0901234567 --replace')
    process.exit(1)
  }

  await connectDB()

  const user = await User.findOne({ phone_number: phone }).select('full_name role store_id')
  if (!user) {
    console.error(`User not found with phone: ${phone}`)
    process.exit(1)
  }
  if (!user.store_id) {
    console.error(`User ${user.full_name} does not have store_id`)
    process.exit(1)
  }

  const storeId = user.store_id

  if (shouldReplace) {
    const deleteResult = await Category.deleteMany({ store_id: storeId })
    console.log(`Deleted ${deleteResult.deletedCount ?? 0} existing categories`)
  }

  const docs = SAMPLE_CATEGORIES.map((item) => ({
    store_id: storeId,
    name: item.name,
    is_active: item.is_active
  }))

  const inserted = await Category.insertMany(docs, { ordered: true })
  console.log(`Seeded ${inserted.length} categories for store ${storeId.toString()}`)
}

run()
  .catch((error) => {
    console.error('Seed categories failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await mongoose.disconnect()
  })
