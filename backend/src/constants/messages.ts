export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  STORE_NAME_IS_REQUIRED: 'Tên cửa hàng là bắt buộc',
  STORE_NAME_MUST_BE_STRING: 'Tên cửa hàng phải là chuỗi',
  FULL_NAME_IS_REQUIRED: 'Họ tên là bắt buộc',
  FULL_NAME_MUST_BE_STRING: 'Họ tên phải là chuỗi',
  PHONE_NUMBER_IS_REQUIRED: 'Số điện thoại là bắt buộc',
  PHONE_NUMBER_IS_INVALID: 'Số điện thoại không hợp lệ',
  PHONE_NUMBER_ALREADY_EXISTS: 'Số điện thoại đã tồn tại',
  PASSWORD_IS_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_20: 'Mật khẩu phải từ 6 đến 20 ký tự',
  PASSWORD_MUST_INCLUDE_UPPER_SPECIAL_NUMBER: 'Mật khẩu phải có ít nhất 1 chữ in hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME: 'Xác nhận mật khẩu không khớp',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký chủ cửa hàng thành công',
  REGISTER_STAFF_SUCCESS: 'Tạo tài khoản nhân viên thành công',
  REGISTER_STAFF_SELF_SUCCESS: 'Đăng ký tài khoản nhân viên thành công',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  GET_ME_SUCCESS: 'Lấy thông tin người dùng thành công',
  USER_NOT_FOUND: 'Không tìm thấy người dùng',
  ONLY_OWNER_CAN_CREATE_STAFF: 'Chỉ chủ cửa hàng mới có quyền tạo nhân viên',
  ONLY_OWNER_CAN_DO_THIS: 'Chỉ chủ cửa hàng mới có quyền thực hiện',
  PHONE_OR_PASSWORD_IS_INCORRECT: 'Số điện thoại hoặc mật khẩu không đúng',
  ACCOUNT_IS_INACTIVE: 'Tài khoản đã bị vô hiệu hóa',
  ACCOUNT_IS_BLOCKED: 'Tài khoản đã bị khóa',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token là bắt buộc',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token là bắt buộc',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token không hợp lệ',
  REFRESH_TOKEN_SUCCESS: 'Làm mới token thành công'
} as const

export const CATEGORIES_MESSAGES = {
  NAME_IS_REQUIRED: 'Tên danh mục là bắt buộc',
  NAME_MUST_BE_STRING: 'Tên danh mục phải là chuỗi',
  NAME_TOO_LONG: 'Tên danh mục không được vượt quá 100 ký tự',
  IS_ACTIVE_MUST_BE_BOOLEAN: 'Trạng thái phải là true hoặc false',
  CATEGORY_NOT_FOUND: 'Không tìm thấy danh mục',
  GET_CATEGORIES_SUCCESS: 'Lấy danh sách danh mục thành công',
  CREATE_CATEGORY_SUCCESS: 'Tạo danh mục thành công',
  UPDATE_CATEGORY_SUCCESS: 'Cập nhật danh mục thành công',
  DELETE_CATEGORY_SUCCESS: 'Xóa danh mục thành công'
} as const

export const PRODUCTS_MESSAGES = {
  NAME_IS_REQUIRED: 'Tên sản phẩm là bắt buộc',
  NAME_MUST_BE_STRING: 'Tên sản phẩm phải là chuỗi',
  NAME_TOO_LONG: 'Tên sản phẩm không được vượt quá 200 ký tự',
  BARCODE_MUST_BE_STRING: 'Mã vạch phải là chuỗi',
  PRICE_IS_REQUIRED: 'Giá bán là bắt buộc',
  PRICE_MUST_BE_NON_NEGATIVE: 'Giá bán phải lớn hơn hoặc bằng 0',
  IMAGE_URL_MUST_BE_URL: 'Đường dẫn hình ảnh không hợp lệ',
  IS_ACTIVE_MUST_BE_BOOLEAN: 'Trạng thái phải là true hoặc false',
  TRACK_INVENTORY_MUST_BE_BOOLEAN: 'track_inventory phải là true hoặc false',
  CATEGORY_ID_MUST_BE_MONGO_ID: 'category_id không hợp lệ',
  CATEGORY_NOT_BELONG_TO_STORE: 'Danh mục không thuộc cửa hàng này',
  PRODUCT_NOT_FOUND: 'Không tìm thấy sản phẩm',
  GET_PRODUCTS_SUCCESS: 'Lấy danh sách sản phẩm thành công',
  GET_PRODUCT_SUCCESS: 'Lấy thông tin sản phẩm thành công',
  CREATE_PRODUCT_SUCCESS: 'Tạo sản phẩm thành công',
  UPDATE_PRODUCT_SUCCESS: 'Cập nhật sản phẩm thành công',
  DELETE_PRODUCT_SUCCESS: 'Xóa sản phẩm thành công'
} as const

export const INVENTORY_MESSAGES = {
  ON_HAND_IS_REQUIRED: 'Số lượng tồn kho là bắt buộc',
  ON_HAND_MUST_BE_NON_NEGATIVE_INT: 'Số lượng tồn kho phải là số nguyên không âm',
  STOCK_NOT_FOUND: 'Không tìm thấy tồn kho cho sản phẩm này',
  PRODUCT_NOT_BELONG_TO_STORE: 'Sản phẩm không thuộc cửa hàng này',
  INSUFFICIENT_STOCK: 'Số lượng tồn kho không đủ',
  GET_STOCKS_SUCCESS: 'Lấy danh sách tồn kho thành công',
  GET_STOCK_SUCCESS: 'Lấy thông tin tồn kho thành công',
  UPDATE_STOCK_SUCCESS: 'Cập nhật tồn kho thành công'
} as const

export const ORDERS_MESSAGES = {
  ITEMS_IS_REQUIRED: 'Danh sách sản phẩm là bắt buộc',
  ITEMS_MUST_BE_ARRAY: 'items phải là mảng và có ít nhất 1 sản phẩm',
  ORDER_ITEM_PRODUCT_ID_REQUIRED: 'product_id trong items là bắt buộc',
  ORDER_ITEM_PRODUCT_ID_MUST_BE_MONGO_ID: 'product_id trong items không hợp lệ',
  ORDER_ITEM_QUANTITY_MUST_BE_POSITIVE_INT: 'quantity trong items phải là số nguyên dương',
  NOTE_MUST_BE_STRING: 'Ghi chú phải là chuỗi',
  PAYMENT_METHOD_IS_INVALID: 'Phương thức thanh toán không hợp lệ',
  PAYMENT_STATUS_IS_INVALID: 'Trạng thái thanh toán không hợp lệ',
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
  PRODUCT_NOT_FOUND: 'Có sản phẩm không tồn tại hoặc không thuộc cửa hàng',
  GET_ORDERS_SUCCESS: 'Lấy danh sách đơn hàng thành công',
  GET_ORDER_SUCCESS: 'Lấy chi tiết đơn hàng thành công',
  CREATE_ORDER_SUCCESS: 'Tạo đơn hàng thành công'
} as const
