import { z } from "zod";

// Phone validation: exactly 10 digits starting with 0 (matches backend: /^0\d{9}$/)
const phoneValidation = z
  .string()
  .min(1, "Vui lòng nhập số điện thoại")
  .regex(/^0\d{9}$/, "Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0");

// Password validation: must have 1 uppercase, 1 lowercase, 1 number, 1 special character
const passwordValidation = z
  .string()
  .min(1, "Vui lòng nhập mật khẩu")
  .regex(/[A-Z]/, "Mật khẩu phải có ít nhất 1 chữ hoa")
  .regex(/[a-z]/, "Mật khẩu phải có ít nhất 1 chữ thường")
  .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số")
  .regex(/[^A-Za-z0-9]/, "Mật khẩu phải có ít nhất 1 ký tự đặc biệt");

// Owner name validation: no numbers allowed
const ownerNameValidation = z
  .string()
  .min(1, "Vui lòng nhập tên chủ cửa hàng")
  .regex(/^[^0-9]*$/, "Tên chủ cửa hàng không được chứa số");

export const loginSchema = z.object({
  phone: phoneValidation,
  password: passwordValidation,
});

export const registerOwnerSchema = z
  .object({
    storeName: z.string().min(1, "Vui lòng nhập tên cửa hàng"),
    ownerName: ownerNameValidation,
    phone: phoneValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const registerStaffSchema = z
  .object({
    fullName: z.string().min(1, "Vui lòng nhập tên đầy đủ"),
    phone: phoneValidation,
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const forgotPasswordPhoneSchema = z.object({
  phone: phoneValidation,
});

export const forgotPasswordOtpSchema = z.object({
  otp: z.string().length(6, "Mã OTP phải có 6 số"),
});

export const forgotPasswordResetSchema = z
  .object({
    password: passwordValidation,
    confirmPassword: z.string().min(1, "Vui lòng nhập lại mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Inferred types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterOwnerFormData = z.infer<typeof registerOwnerSchema>;
export type RegisterStaffFormData = z.infer<typeof registerStaffSchema>;
export type ForgotPasswordPhoneFormData = z.infer<
  typeof forgotPasswordPhoneSchema
>;
export type ForgotPasswordOtpFormData = z.infer<typeof forgotPasswordOtpSchema>;
export type ForgotPasswordResetFormData = z.infer<
  typeof forgotPasswordResetSchema
>;
