import mongoose from 'mongoose'
import envConfig from './env.js'

const MONGODB_URI = envConfig.mongodbUri

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('✅ MongoDB connected successfully')
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  }
}

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})

export default connectDB
