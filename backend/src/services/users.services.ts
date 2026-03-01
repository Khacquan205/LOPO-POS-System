import { Types } from 'mongoose'
import User from '~/models/schemas/User.schema.js'
import Store from '~/models/schemas/Store.schema.js'
import RefreshToken from '~/models/RefreshToken.schema.js'
import { hashPassword, comparePassword } from '~/utils/crypto.js'
import { signToken, verifyToken } from '~/utils/jwt.js'
import { TokenType, UserRole } from '~/constants/enum.js'
import { envConfig } from '~/config/index.js'
import { ErrorWithStatus } from '~/middlewares/error.middlewares.js'
import HTTP_STATUS from '~/constants/httpStatus.js'
import { USERS_MESSAGES } from '~/constants/messages.js'

interface RegisterOwnerReqBody {
  store_name: string
  full_name: string
  phone_number: string
  password: string
  confirm_password: string
}

interface RegisterStaffReqBody {
  full_name: string
  phone_number: string
  password: string
  confirm_password: string
}

interface LoginReqBody {
  phone_number: string
  password: string
}

class UsersService {
  private async createStaffAccount(payload: RegisterStaffReqBody) {
    const phoneExisted = await this.checkPhoneNumberExists(payload.phone_number)
    if (phoneExisted) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PHONE_NUMBER_ALREADY_EXISTS,
        status: HTTP_STATUS.UNPROCESSABLE_ENTITY
      })
    }

    const staff = await User.create({
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      password: hashPassword(payload.password),
      role: UserRole.Staff
    })

    const user_id = staff._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, staff.role)

    await RefreshToken.create({
      user_id: new Types.ObjectId(user_id),
      token: refresh_token
    })

    return {
      access_token,
      refresh_token,
      staff: {
        _id: staff._id,
        full_name: staff.full_name,
        phone_number: staff.phone_number,
        role: staff.role,
        created_at: staff.createdAt,
        updated_at: staff.updatedAt
      }
    }
  }

  private signAccessToken(user_id: string, role: string) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: envConfig.jwt.accessExpiresIn as any
      },
      secretOrPrivateKey: envConfig.jwt.accessSecret
    })
  }

  private signRefreshToken(user_id: string, role: string) {
    return signToken({
      payload: {
        user_id,
        role,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: envConfig.jwt.refreshExpiresIn as any
      },
      secretOrPrivateKey: envConfig.jwt.refreshSecret
    })
  }

  private signAccessAndRefreshToken(user_id: string, role: string) {
    return Promise.all([this.signAccessToken(user_id, role), this.signRefreshToken(user_id, role)])
  }

  async checkPhoneNumberExists(phone_number: string) {
    const user = await User.findOne({ phone_number })
    return Boolean(user)
  }

  async registerOwner(payload: RegisterOwnerReqBody) {
    const user = await User.create({
      full_name: payload.full_name,
      phone_number: payload.phone_number,
      password: hashPassword(payload.password),
      role: UserRole.Owner
    })

    const store = await Store.create({
      name: payload.store_name,
      owner_id: user._id
    })

    const user_id = user._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, user.role)

    await RefreshToken.create({
      user_id: new Types.ObjectId(user_id),
      token: refresh_token
    })

    return {
      access_token,
      refresh_token,
      owner: {
        _id: user._id,
        full_name: user.full_name,
        phone_number: user.phone_number,
        role: user.role,
        created_at: user.createdAt,
        updated_at: user.updatedAt
      },
      store: {
        _id: store._id,
        name: store.name,
        owner_id: store.owner_id,
        created_at: store.createdAt,
        updated_at: store.updatedAt
      }
    }
  }

  async registerStaffByOwner(owner_user_id: string, payload: RegisterStaffReqBody) {
    const owner = await User.findById(owner_user_id)
    if (!owner || owner.role !== UserRole.Owner) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.ONLY_OWNER_CAN_CREATE_STAFF,
        status: HTTP_STATUS.FORBIDDEN
      })
    }

    return this.createStaffAccount(payload)
  }

  async registerStaff(payload: RegisterStaffReqBody) {
    return this.createStaffAccount(payload)
  }

  async login(payload: LoginReqBody) {
    const user = await User.findOne({ phone_number: payload.phone_number })
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PHONE_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const matched = await comparePassword(payload.password, user.password)
    if (!matched) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.PHONE_OR_PASSWORD_IS_INCORRECT,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const user_id = user._id.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id, user.role)

    await RefreshToken.create({
      user_id: new Types.ObjectId(user_id),
      token: refresh_token
    })

    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await RefreshToken.deleteOne({ token: refresh_token })
  }

  async refreshToken(refresh_token: string) {
    const tokenDoc = await RefreshToken.findOne({ token: refresh_token })
    if (!tokenDoc) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }

    const decoded = await verifyToken({ token: refresh_token, secretOrPublicKey: envConfig.jwt.refreshSecret })
    const user_id = String(decoded.user_id)
    const role = String(decoded.role)

    const [access_token, new_refresh_token] = await this.signAccessAndRefreshToken(user_id, role)

    await RefreshToken.deleteOne({ token: refresh_token })
    await RefreshToken.create({ user_id: new Types.ObjectId(user_id), token: new_refresh_token })

    return { access_token, refresh_token: new_refresh_token }
  }

  async getMe(user_id: string) {
    const user = await User.findById(user_id).select('-password')
    if (!user) {
      throw new ErrorWithStatus({
        message: USERS_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }
}

const usersService = new UsersService()
export default usersService
