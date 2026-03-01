import jwt, { type SignOptions } from 'jsonwebtoken'
import { envConfig } from '~/config/index.js'

interface SignTokenParams {
  payload: string | Buffer | object
  options?: SignOptions
  secretOrPrivateKey?: string
}

export const signToken = ({ payload, options, secretOrPrivateKey = envConfig.jwt.accessSecret }: SignTokenParams) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secretOrPrivateKey, options ?? {}, (error, token) => {
      if (error) {
        return reject(error)
      }
      return resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey = envConfig.jwt.accessSecret
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) {
        return reject(error)
      }
      return resolve(decoded as jwt.JwtPayload)
    })
  })
}
