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
            example: '123456'
          },
          confirm_password: {
            type: 'string',
            minLength: 6,
            example: '123456'
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
            example: '123456'
          },
          confirm_password: {
            type: 'string',
            minLength: 6,
            example: '123456'
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
            example: '123456'
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
            description: 'Đăng ký chủ cửa hàng thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Đăng ký chủ cửa hàng thành công' },
                    result: {
                      $ref: '#/components/schemas/RegisterOwnerResult'
                    }
                  }
                }
              }
            }
          },
          '422': {
            description: 'Dữ liệu không hợp lệ hoặc trùng số điện thoại',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
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
            description: 'Đăng ký tài khoản nhân viên thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Đăng ký tài khoản nhân viên thành công' },
                    result: {
                      $ref: '#/components/schemas/RegisterStaffResult'
                    }
                  }
                }
              }
            }
          },
          '422': {
            description: 'Dữ liệu không hợp lệ hoặc trùng số điện thoại',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
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
            description: 'Tạo tài khoản nhân viên thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Tạo tài khoản nhân viên thành công' },
                    result: {
                      $ref: '#/components/schemas/RegisterStaffResult'
                    }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Thiếu hoặc sai access token',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '403': {
            description: 'Không phải owner',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
          },
          '422': {
            description: 'Dữ liệu không hợp lệ hoặc trùng số điện thoại',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                }
              }
            }
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
            description: 'Đăng nhập thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Đăng nhập thành công' },
                    result: { $ref: '#/components/schemas/LoginResult' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Sai số điện thoại hoặc mật khẩu',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '422': {
            description: 'Dữ liệu không hợp lệ',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
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
            description: 'Đăng xuất thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Đăng xuất thành công' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Thiếu hoặc sai access token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '422': {
            description: 'Refresh token không hợp lệ',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
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
            description: 'Làm mới token thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Làm mới token thành công' },
                    result: {
                      $ref: '#/components/schemas/RefreshTokenResult'
                    }
                  }
                }
              }
            }
          },
          '422': {
            description: 'Refresh token không hợp lệ',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
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
            description: 'Lấy thông tin thành công',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Lấy thông tin người dùng thành công' },
                    result: { $ref: '#/components/schemas/MeResult' }
                  }
                }
              }
            }
          },
          '401': {
            description: 'Thiếu hoặc sai access token',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          },
          '404': {
            description: 'Không tìm thấy người dùng',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' }
              }
            }
          }
        }
      }
    }
  }
} as const

export default openApiSpec
