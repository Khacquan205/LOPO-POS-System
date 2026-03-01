import dotenv from 'dotenv'

dotenv.config()

const getRequiredEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

const envConfig = {
  port: Number(getRequiredEnv('PORT')),
  mongodbUri: getRequiredEnv('MONGODB_URI'),
  jwt: {
    accessSecret: getRequiredEnv('JWT_ACCESS_SECRET'),
    refreshSecret: getRequiredEnv('JWT_REFRESH_SECRET'),
    accessExpiresIn: getRequiredEnv('JWT_ACCESS_EXPIRES_IN'),
    refreshExpiresIn: getRequiredEnv('JWT_REFRESH_EXPIRES_IN')
  }
} as const

export default envConfig
