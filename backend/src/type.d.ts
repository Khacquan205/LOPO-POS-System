declare namespace Express {
  interface Request {
    decoded_authorization?: {
      user_id?: string
      role?: string
      token_type?: string
      iat?: number
      exp?: number
      [key: string]: unknown
    }
  }
}
