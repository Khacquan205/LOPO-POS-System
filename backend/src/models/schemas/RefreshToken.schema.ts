import { Schema, Types, model, type InferSchemaType } from 'mongoose'

const refreshTokenSchema = new Schema(
  {
    refresh_token_id: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      default: () => new Types.ObjectId()
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    token: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

export type RefreshTokenType = InferSchemaType<typeof refreshTokenSchema>

const RefreshToken = model<RefreshTokenType>('refresh_tokens', refreshTokenSchema)

export default RefreshToken
