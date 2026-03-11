export enum UserRole {
  Owner = 'owner',
  Staff = 'staff'
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Blocked = 'blocked'
}

export enum TokenType {
  AccessToken = 'AccessToken',
  RefreshToken = 'RefreshToken'
}

export enum OrderStatus {
  Draft = 'draft',
  Completed = 'completed',
  Cancelled = 'cancelled'
}

export enum PaymentMethod {
  Cash = 'cash',
  BankTransfer = 'bank_transfer',
  VietQR = 'vietqr',
  EWallet = 'ewallet'
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Refunded = 'refunded'
}

export enum JoinRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected'
}
