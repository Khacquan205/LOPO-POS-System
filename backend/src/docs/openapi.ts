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
          _id: { type: 'string' },
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
          _id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2d' },
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
          is_active: { type: 'boolean', example: false }
        }
      },
      ProductResult: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2e' },
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          category_id: { type: 'string', nullable: true, example: '67c2f0ef8f3f2f2f2f2f2f2d' },
          name: { type: 'string', example: 'Trà sữa trân châu' },
          price: { type: 'number', example: 35000 },
          barcode: { type: 'string', nullable: true, example: '8936001234567' },
          image_url: { type: 'string', nullable: true, example: 'https://example.com/image.jpg' },
          track_inventory: { type: 'boolean', example: false },
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
          _id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f30' },
          store_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2c' },
          product_id: { type: 'object', description: 'Thông tin sản phẩm (populated)' },
          on_hand: { type: 'integer', example: 25 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      CreateOrderRequest: {
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
          },
          note: { type: 'string', nullable: true, example: 'Khách mang về' },
          payment_method: { type: 'string', enum: ['cash', 'bank_transfer', 'vietqr', 'ewallet'], example: 'cash' },
          payment_status: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'], example: 'paid' }
        }
      },
      OrderResult: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '67d2f0ef8f3f2f2f2f2f2f2a' },
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
          _id: { type: 'string', example: '67d2f0ef8f3f2f2f2f2f2f2d' },
          order_id: { type: 'string', example: '67d2f0ef8f3f2f2f2f2f2f2a' },
          product_id: { type: 'string', example: '67c2f0ef8f3f2f2f2f2f2f2e' },
          product_name_snapshot: { type: 'string', example: 'Trà sữa trân châu' },
          barcode_snapshot: { type: 'string', nullable: true, example: '8936001234567' },
          unit_price: { type: 'number', example: 35000 },
          quantity: { type: 'integer', example: 2 },
          line_total: { type: 'number', example: 70000 },
          createdAt: { type: 'string', format: 'date-time' }
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
    '/api/categories/{id}': {
      put: {
        tags: ['Categories'],
        summary: 'Cập nhật danh mục',
        description: 'Cập nhật thông tin danh mục theo ID. Cả owner và staff đều dùng được.',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của danh mục'
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
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của danh mục'
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
        description: 'Tạo một sản phẩm mới cho cửa hàng. Nếu có category_id thì phải thuộc cùng cửa hàng.',
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
          '422': { description: 'Dữ liệu không hợp lệ' }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Lấy chi tiết sản phẩm',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của sản phẩm'
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
            name: 'id',
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
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của sản phẩm'
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
        summary: 'Tạo đơn hàng và trừ tồn kho',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateOrderRequest' }
            }
          }
        },
        responses: {
          '201': { description: 'Tạo đơn hàng thành công' },
          '400': { description: 'Sản phẩm không hợp lệ hoặc không đủ tồn kho' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '422': { description: 'Dữ liệu không hợp lệ' }
        }
      }
    },
    '/api/orders/{id}': {
      get: {
        tags: ['Orders'],
        summary: 'Lấy chi tiết đơn hàng',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
            description: 'ID của đơn hàng'
          }
        ],
        responses: {
          '200': { description: 'Lấy chi tiết đơn hàng thành công' },
          '401': { description: 'Thiếu hoặc sai access token' },
          '403': { description: 'Tài khoản chưa liên kết cửa hàng' },
          '404': { description: 'Không tìm thấy đơn hàng' }
        }
      }
    }
  }
} as const

export default openApiSpec
