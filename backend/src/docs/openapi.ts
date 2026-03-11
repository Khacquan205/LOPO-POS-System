const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'LOPO POS Backend API',
    version: '1.0.0',
    description:
      'Tài liệu API cho hệ thống LOPO POS. Bao gồm đăng ký chủ cửa hàng, đăng ký nhân viên, đăng nhập, làm mới token, đăng xuất và lấy thông tin tài khoản hiện tại.'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    }
  ],
  tags: [
    {
      name: 'Users',
      description: 'User authentication and account management'
    },
    {
      name: 'Categories',
      description: 'Quản lý danh mục sản phẩm'
    },
    {
      name: 'Products',
      description: 'Quản lý sản phẩm (cả owner và staff)'
    },
    {
      name: 'Inventory Stocks',
      description: 'Quản lý tồn kho sản phẩm (cả owner và staff)'
    },
    {
      name: 'Orders',
      description: 'Quản lý đơn hàng bán (cả owner và staff)'
    },
    {
      name: 'Stores',
      description: 'Quản lý QR cửa hàng và duyệt yêu cầu nhân viên tham gia'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Validation error'
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              additionalProperties: true
            }
          }
        },
        required: ['message']
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          result: {
            type: 'object',
            additionalProperties: true
          }
        },
        required: ['message']
      },
      RegisterOwnerRequest: {
        type: 'object',
        required: ['store_name', 'full_name', 'phone_number', 'password', 'confirm_password'],
        properties: {
          store_name: {
            type: 'string',
            example: 'LOPO Mart Quận 1'
          },
          full_name: {
            type: 'string',
            example: 'Nguyen Van Owner'
          },
          phone_number: {
            type: 'string',
            example: '0901234567'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'Abc123@'
          },
          confirm_password: {
            type: 'string',
            minLength: 6,
            example: 'Abc123@'
          }
        }
      },
      RegisterStaffRequest: {
        type: 'object',
        required: ['full_name', 'phone_number', 'password', 'confirm_password'],
        properties: {
          full_name: {
            type: 'string',
            example: 'Nguyen Van Staff'
          },
          phone_number: {
            type: 'string',
            example: '0912345678'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'Abc123@'
          },
          confirm_password: {
            type: 'string',
            minLength: 6,
            example: 'Abc123@'
          }
        }
      },
      LoginRequest: {
        type: 'object',
        required: ['phone_number', 'password'],
        properties: {
          phone_number: {
            type: 'string',
            example: '0901234567'
          },
          password: {
            type: 'string',
            minLength: 6,
            example: 'Abc123@'
          }
        }
      },
      RefreshTokenRequest: {
        type: 'object',
        required: ['refresh_token'],
        properties: {
          refresh_token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
          }
        }
      },
      OwnerProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2a' },
          full_name: { type: 'string', example: 'Nguyen Van Owner' },
          phone_number: { type: 'string', example: '0901234567' },
          role: { type: 'string', enum: ['owner'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      StaffProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2b' },
          full_name: { type: 'string', example: 'Nguyen Van Staff' },
          phone_number: { type: 'string', example: '0912345678' },
          role: { type: 'string', enum: ['staff'] },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      StoreProfile: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          name: { type: 'string', example: 'LOPO Mart Quận 1' },
          owner_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2a' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' }
        }
      },
      RegisterOwnerResult: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          refresh_token: { type: 'string' },
          owner: {
            $ref: '#/components/schemas/OwnerProfile'
          },
          store: {
            $ref: '#/components/schemas/StoreProfile'
          }
        },
        required: ['access_token', 'refresh_token', 'owner', 'store']
      },
      RegisterStaffResult: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          refresh_token: { type: 'string' },
          staff: {
            $ref: '#/components/schemas/StaffProfile'
          }
        },
        required: ['access_token', 'refresh_token', 'staff']
      },
      LoginResult: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          refresh_token: { type: 'string' }
        },
        required: ['access_token', 'refresh_token']
      },
      RefreshTokenResult: {
        type: 'object',
        properties: {
          access_token: { type: 'string' },
          refresh_token: { type: 'string' }
        },
        required: ['access_token', 'refresh_token']
      },
      MeResult: {
        type: 'object',
        properties: {
          user_id: { type: 'string' },
          full_name: { type: 'string' },
          phone_number: { type: 'string' },
          role: { type: 'string', enum: ['owner', 'staff'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateCategoryRequest: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string', maxLength: 100, example: 'Đồ uống' },
          is_active: { type: 'boolean', example: true }
        }
      },
      UpdateCategoryRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: 100, example: 'Đồ ăn' },
          is_active: { type: 'boolean', example: false }
        }
      },
      CategoryResult: {
        type: 'object',
        properties: {
          category_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2d' },
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          name: { type: 'string', example: 'Đồ uống' },
          is_active: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateProductRequest: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: { type: 'string', maxLength: 200, example: 'Trà sữa trân châu' },
          price: { type: 'number', minimum: 0, example: 35000 },
          category_id: { type: 'string', nullable: true, example: '67c2f0ef8f3f2f2f2f2f2f2d' },
          barcode: { type: 'string', example: '8936001234567' },
          image_url: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
          track_inventory: { type: 'boolean', example: false },
          on_hand: {
            type: 'integer',
            minimum: 0,
            example: 20,
            description:
              'Số lượng tồn kho khởi tạo. Chỉ hợp lệ khi track_inventory = true. Nếu track_inventory = false mà on_hand > 0 sẽ trả 422.'
          },
          is_active: { type: 'boolean', example: true }
        }
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          name: { type: 'string', maxLength: 200, example: 'Trà sữa trân châu đen' },
          price: { type: 'number', minimum: 0, example: 38000 },
          category_id: { type: 'string', nullable: true, example: '67c2f0ef8f3f2f2f2f2f2f2d' },
          barcode: { type: 'string', example: '8936001234567' },
          image_url: { type: 'string', format: 'uri', example: 'https://example.com/image.jpg' },
          track_inventory: { type: 'boolean', example: false },
          on_hand: {
            type: 'integer',
            minimum: 0,
            example: 15,
            description:
              'Số lượng tồn kho cần cập nhật. Nếu trạng thái track_inventory sau cập nhật = false thì chỉ cho phép on_hand = 0.'
          },
          is_active: { type: 'boolean', example: false }
        }
      },
      ProductResult: {
        type: 'object',
        properties: {
          product_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2e' },
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          category_id: { type: 'string', nullable: true, example: '67c2f0ef8f3f2f2f2f2f2f2d' },
          name: { type: 'string', example: 'Trà sữa trân châu' },
          price: { type: 'number', example: 35000 },
          barcode: { type: 'string', nullable: true, example: '8936001234567' },
          image_url: { type: 'string', nullable: true, example: 'https://example.com/image.jpg' },
          track_inventory: { type: 'boolean', example: false },
          on_hand: { type: 'integer', minimum: 0, example: 25 },
          is_active: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      AdjustStockRequest: {
        type: 'object',
        required: ['on_hand'],
        properties: {
          on_hand: { type: 'integer', minimum: 0, example: 10 }
        }
      },
      InventoryStockResult: {
        type: 'object',
        properties: {
          inventory_stock_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f30' },
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          product_id: { type: 'object', description: 'Thông tin sản phẩm (populated)' },
          on_hand: { type: 'integer', example: 25 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      UpdateOrderItemsRequest: {
        type: 'object',
        required: ['items'],
        properties: {
          items: {
            type: 'array',
            minItems: 1,
            items: {
              type: 'object',
              required: ['product_id', 'quantity'],
              properties: {
                product_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2e' },
                quantity: { type: 'integer', minimum: 1, example: 2 }
              }
            }
          }
        }
      },
      CheckoutOrderRequest: {
        type: 'object',
        properties: {
          payment_method: { type: 'string', enum: ['cash', 'bank_transfer', 'vietqr', 'ewallet'], example: 'cash' },
          payment_status: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'], example: 'paid' },
          note: { type: 'string', nullable: true, example: 'Khách mang về' }
        }
      },
      OrderResult: {
        type: 'object',
        properties: {
          order_id: { type: 'string', example: '67d2f0ef8f3f2f2f2f2f2f2a' },
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          order_code: { type: 'string', example: 'OD123456789012' },
          cashier_user_id: { type: 'string', example: '67b2f0ef8f3f2f2f2f2f2f2b' },
          status: { type: 'string', enum: ['draft', 'completed', 'cancelled'], example: 'completed' },
          payment_method: { type: 'string', enum: ['cash', 'bank_transfer', 'vietqr', 'ewallet'], example: 'cash' },
          payment_status: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'], example: 'paid' },
          grand_total: { type: 'number', example: 70000 },
          note: { type: 'string', nullable: true, example: 'Khách mang về' },
          completed_at: { type: 'string', format: 'date-time', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      OrderItemResult: {
        type: 'object',
        properties: {
          order_item_id: { type: 'string', example: '67d2f0ef8f3f2f2f2f2f2f2d' },
          order_id: { type: 'string', example: '67d2f0ef8f3f2f2f2f2f2f2a' },
          product_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2e' },
          product_name_snapshot: { type: 'string', example: 'Trà sữa trân châu' },
          barcode_snapshot: { type: 'string', nullable: true, example: '8936001234567' },
          unit_price: { type: 'number', example: 35000 },
          quantity: { type: 'integer', example: 2 },
          line_total: { type: 'number', example: 70000 },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      JoinByQrRequest: {
        type: 'object',
        required: ['qr_code'],
        properties: {
          qr_code: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' }
        }
      },
      StoreQrResult: {
        type: 'object',
        properties: {
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          store_name: { type: 'string', example: 'LOPO Mart Quận 1' },
          qr_code: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' }
        }
      },
      JoinRequestResult: {
        type: 'object',
        properties: {
          request_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f20' },
          staff_user_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2b' },
          staff_full_name: { type: 'string', nullable: true, example: 'Nguyen Van A' },
          staff_phone_number: { type: 'string', nullable: true, example: '0901234567' },
          status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: 'pending' },
          requested_at: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/api/users/register-owner': {
      post: {
        tags: ['Users'],
        summary: 'Đăng ký chủ cửa hàng',
        description: 'Tạo tài khoản owner và tạo cửa hàng đầu tiên, sau đó trả token đăng nhập.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterOwnerRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Đăng ký chủ cửa hàng thành công'
          },
          '422': {
            description: 'Dữ liệu không hợp lệ hoặc trùng số điện thoại'
          }
        }
      }
    },
    '/api/users/register-staff': {
      post: {
        tags: ['Users'],
        summary: 'Nhân viên tự đăng ký tài khoản',
        description: 'Tạo tài khoản staff công khai và trả token đăng nhập ngay.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterStaffRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Đăng ký tài khoản nhân viên thành công'
          },
          '422': {
            description: 'Dữ liệu không hợp lệ hoặc trùng số điện thoại'
          }
        }
      }
    },
    '/api/users/staff': {
      post: {
        tags: ['Users'],
        summary: 'Owner tạo tài khoản staff',
        description: 'Yêu cầu access token owner. Tạo staff và trả token đăng nhập cho staff đó.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RegisterStaffRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Tạo tài khoản nhân viên thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '403': {
            description: 'Không phải owner'
          },
          '422': {
            description: 'Dữ liệu không hợp lệ hoặc trùng số điện thoại'
          }
        }
      }
    },
    '/api/users/login': {
      post: {
        tags: ['Users'],
        summary: 'Đăng nhập',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/LoginRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Đăng nhập thành công'
          },
          '401': {
            description: 'Sai số điện thoại hoặc mật khẩu'
          },
          '422': {
            description: 'Dữ liệu không hợp lệ'
          }
        }
      }
    },
    '/api/users/logout': {
      post: {
        tags: ['Users'],
        summary: 'Đăng xuất',
        description: 'Yêu cầu access token + refresh_token để hủy phiên.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Đăng xuất thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '422': {
            description: 'Refresh token không hợp lệ'
          }
        }
      }
    },
    '/api/users/refresh-token': {
      post: {
        tags: ['Users'],
        summary: 'Làm mới access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Làm mới token thành công'
          },
          '422': {
            description: 'Refresh token không hợp lệ'
          }
        }
      }
    },
    '/api/users/me': {
      get: {
        tags: ['Users'],
        summary: 'Lấy thông tin tài khoản hiện tại',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lấy thông tin thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '404': {
            description: 'Không tìm thấy người dùng'
          }
        }
      }
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Lấy danh sách danh mục',
        description: 'Trả về tất cả danh mục của cửa hàng hiện tại. Cả owner và staff đều dùng được.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Lấy danh sách danh mục thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '403': {
            description: 'Tài khoản chưa liên kết cửa hàng'
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Tạo danh mục mới',
        description: 'Tạo một danh mục mới cho cửa hàng. Cả owner và staff đều dùng được.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCategoryRequest'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Tạo danh mục thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '403': {
            description: 'Tài khoản chưa liên kết cửa hàng'
          },
          '422': {
            description: 'Dữ liệu không hợp lệ'
          }
        }
      }
    },
    '/api/categories/{category_id}': {
      put: {
        tags: ['Categories'],
        summary: 'Cập nhật danh mục',
        description: 'Cập nhật thông tin danh mục theo ID. Cả owner và staff đều dùng được.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'category_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'category_id của danh mục'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateCategoryRequest'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Cập nhật danh mục thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '403': {
            description: 'Tài khoản chưa liên kết cửa hàng'
          },
          '404': {
            description: 'Không tìm thấy danh mục'
          },
          '422': {
            description: 'Dữ liệu không hợp lệ'
          }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Xóa danh mục',
        description: 'Xóa danh mục theo ID. Cả owner và staff đều dùng được.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'category_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'category_id của danh mục'
          }
        ],
        responses: {
          '200': {
            description: 'Xóa danh mục thành công'
          },
          '401': {
            description: 'Thiếu hoặc sai access token'
          },
          '403': {
            description: 'Tài khoản chưa liên kết cửa hàng'
          },
          '404': {
            description: 'Không tìm thấy danh mục'
          }
        }
      }
    },
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Lấy danh sách sản phẩm',
        description: 'Trả về toàn bộ sản phẩm của cửa hàng, sắp xếp theo ngày tạo mới nhất.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lấy danh sách sản phẩm thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Tạo sản phẩm mới',
        description:
          'Tạo một sản phẩm mới cho cửa hàng. Nếu có category_id thì phải thuộc cùng cửa hàng. Có thể gửi on_hand để tạo tồn kho ban đầu khi track_inventory = true.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateProductRequest' }
            }
          }
        },
        responses: {
          '201': { description: 'Tạo sản phẩm thành công' },
          '400': { description: 'Danh mục không thuộc cửa hàng này' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '422': { description: 'Dữ liệu không hợp lệ (ví dụ: on_hand > 0 khi track_inventory = false)' }
        }
      }
    },
    '/api/products/{product_id}': {
      get: {
        tags: ['Products'],
        summary: 'Lấy chi tiết sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'product_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'product_id của sản phẩm'
          }
        ],
        responses: {
          '200': { description: 'Lấy thông tin sản phẩm thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy sản phẩm' }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Cập nhật sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'product_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'product_id của sản phẩm'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateProductRequest' }
            }
          }
        },
        responses: {
          '200': { description: 'Cập nhật sản phẩm thành công' },
          '400': { description: 'Danh mục không thuộc cửa hàng này' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy sản phẩm' },
          '422': { description: 'Dữ liệu không hợp lệ' }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Xóa sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'product_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'product_id của sản phẩm'
          }
        ],
        responses: {
          '200': { description: 'Xóa sản phẩm thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy sản phẩm' }
        }
      }
    },
    '/api/inventory-stocks': {
      get: {
        tags: ['Inventory Stocks'],
        summary: 'Lấy danh sách tồn kho',
        description: 'Lấy toàn bộ tồn kho của tất cả sản phẩm trong cửa hàng.',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lấy danh sách tồn kho thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' }
        }
      }
    },
    '/api/inventory-stocks/{product_id}': {
      get: {
        tags: ['Inventory Stocks'],
        summary: 'Lấy tồn kho theo sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'product_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của sản phẩm'
          }
        ],
        responses: {
          '200': { description: 'Lấy thông tin tồn kho thành công' },
          '400': { description: 'Sản phẩm không thuộc cửa hàng' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy tồn kho' }
        }
      },
      put: {
        tags: ['Inventory Stocks'],
        summary: 'Cập nhật số lượng tồn kho',
        description: 'Nhập số lượng mới cho sản phẩm (tạo mới bản ghi nếu chưa có).',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'product_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của sản phẩm'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AdjustStockRequest' }
            }
          }
        },
        responses: {
          '200': { description: 'Cập nhật tồn kho thành công' },
          '400': { description: 'Sản phẩm không thuộc cửa hàng' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '422': { description: 'Dữ liệu không hợp lệ' }
        }
      }
    },
    '/api/orders': {
      get: {
        tags: ['Orders'],
        summary: 'Lấy danh sách đơn hàng',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lấy danh sách đơn hàng thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' }
        }
      },
      post: {
        tags: ['Orders'],
        summary: 'Tạo đơn nháp (Flow 1 - Bước 3)',
        description: 'Sinh mã đơn hàng và tạo đơn ở trạng thái Draft. Không cần body.',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Tạo đơn nháp thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' }
        }
      }
    },
    '/api/orders/{order_id}': {
      get: {
        tags: ['Orders'],
        summary: 'Lấy chi tiết đơn hàng',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'order_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'order_id của đơn hàng'
          }
        ],
        responses: {
          '200': { description: 'Lấy chi tiết đơn hàng thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy đơn hàng' }
        }
      }
    },
    '/api/orders/{order_id}/items': {
      put: {
        tags: ['Orders'],
        summary: 'Cập nhật giỏ hàng của đơn nháp (Flow 1 - Bước 4)',
        description: 'Thay thế toàn bộ items của đơn nháp. Tính lại grand_total. Chỉ hoạt động khi status=draft.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'order_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'order_id của đơn hàng'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateOrderItemsRequest' }
            }
          }
        },
        responses: {
          '200': { description: 'Cập nhật giỏ hàng thành công' },
          '400': { description: 'Đơn không ở trạng thái nháp hoặc sản phẩm không hợp lệ' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy đơn hàng' },
          '422': { description: 'Dữ liệu không hợp lệ' }
        }
      }
    },
    '/api/orders/{order_id}/checkout': {
      post: {
        tags: ['Orders'],
        summary: 'Thanh toán đơn nháp → Completed (Flow 1 - Bước 4)',
        description:
          'Xác nhận thanh toán, trừ tồn kho cho sản phẩm track_inventory=true. Chỉ hoạt động khi status=draft và đơn có ít nhất 1 sản phẩm.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'order_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'order_id của đơn hàng'
          }
        ],
        requestBody: {
          required: false,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CheckoutOrderRequest' }
            }
          }
        },
        responses: {
          '200': { description: 'Thanh toán thành công' },
          '400': { description: 'Đơn không hợp lệ, chưa có sản phẩm, hoặc không đủ tồn kho' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy đơn hàng' }
        }
      }
    },
    '/api/orders/{order_id}/cancel': {
      patch: {
        tags: ['Orders'],
        summary: 'Hủy đơn nháp (Flow 2)',
        description: 'Chỉ có thể hủy đơn ở trạng thái Draft. Đơn Completed không thể hủy.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'order_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'order_id của đơn hàng'
          }
        ],
        responses: {
          '200': { description: 'Hủy đơn hàng thành công' },
          '400': { description: 'Đơn đã bị hủy hoặc đã hoàn thành' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy đơn hàng' }
        }
      }
    },
    '/api/stores/qr-code': {
      post: {
        tags: ['Stores'],
        summary: 'Tạo hoặc làm mới QR cửa hàng',
        description: 'Chỉ owner của cửa hàng mới có quyền tạo QR. QR hiện tại chứa store_id.',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Tạo QR cửa hàng thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Không đủ quyền owner' },
          '404': { description: 'Không tìm thấy cửa hàng của owner' }
        }
      }
    },
    '/api/stores/join-by-qr': {
      post: {
        tags: ['Stores'],
        summary: 'Nhân viên quét QR để gửi yêu cầu tham gia cửa hàng',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/JoinByQrRequest' }
            }
          }
        },
        responses: {
          '201': { description: 'Gửi yêu cầu tham gia cửa hàng thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Chỉ staff chưa thuộc cửa hàng mới dùng được' },
          '404': { description: 'Không tìm thấy cửa hàng từ QR code' },
          '409': { description: 'Đã có yêu cầu chờ duyệt hoặc staff đã thuộc cửa hàng' },
          '422': { description: 'Dữ liệu không hợp lệ' }
        }
      }
    },
    '/api/stores/join-requests/pending': {
      get: {
        tags: ['Stores'],
        summary: 'Owner lấy danh sách yêu cầu tham gia đang chờ duyệt',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Lấy danh sách pending thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Không đủ quyền owner' },
          '404': { description: 'Không tìm thấy cửa hàng của owner' }
        }
      }
    },
    '/api/stores/join-requests/{request_id}/approve': {
      post: {
        tags: ['Stores'],
        summary: 'Owner duyệt yêu cầu tham gia cửa hàng của staff',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'request_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'request_id của yêu cầu tham gia'
          }
        ],
        responses: {
          '200': { description: 'Duyệt yêu cầu thành công' },
          '400': { description: 'Yêu cầu không ở trạng thái pending' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Không đủ quyền owner' },
          '404': { description: 'Không tìm thấy request hoặc cửa hàng' },
          '409': { description: 'Nhân viên đã thuộc cửa hàng khác' },
          '422': { description: 'request_id không hợp lệ' }
        }
      }
    },
    '/api/stores/join-requests/{request_id}/reject': {
      post: {
        tags: ['Stores'],
        summary: 'Owner từ chối yêu cầu tham gia cửa hàng của staff',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'request_id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'request_id của yêu cầu tham gia'
          }
        ],
        responses: {
          '200': { description: 'Từ chối yêu cầu thành công' },
          '400': { description: 'Yêu cầu không ở trạng thái pending' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Không đủ quyền owner' },
          '404': { description: 'Không tìm thấy request hoặc cửa hàng' },
          '422': { description: 'request_id không hợp lệ' }
        }
      }
    }
  }
} as const

export default openApiSpec
