// Mock auth service for development
import type { User, AuthPayload } from '../../../types';



const delay = (ms = 1000): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface MockAccount {
  phone: string;
  password: string;
  user: User;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    phone: '0123456789',
    password: 'Admin*1',
    user: {
      id: 'owner_1',
      name: 'Lương Khánh Toàn',
      phone: '0123456789',
      role: 'owner',
      storeId: 'store_1',
      storeName: 'LOPO Coffee & Tea',
    },
  },
  {
    phone: '0987654321',
    password: 'Admin*1',
    user: {
      id: 'owner_2',
      name: 'Trần Thị Bình',
      phone: '0987654321',
      role: 'owner',
      storeId: 'store_2',
      storeName: 'LOPO Bakery',
    },
  },
  {
    phone: '0111222333',
    password: 'Staff*1',
    user: {
      id: 'staff_1',
      name: 'Lê Văn Kiên',
      phone: '0111222333',
      role: 'staff',
      storeId: 'store_1',
      storeName: 'LOPO Coffee & Tea',
    },
  },
];

export const login = async (phone: string, password: string): Promise<AuthPayload> => {
  await delay(1000);

  if (!phone || !password) {
    throw new Error('Vui lòng nhập đầy đủ thông tin');
  }

  const account = MOCK_ACCOUNTS.find(
    (acc) => acc.phone === phone && acc.password === password,
  );

  if (!account) {
    throw new Error('Số điện thoại hoặc mật khẩu không đúng');
  }

  return {
    user: account.user,
    accessToken: 'mock_access_token_' + Date.now(),
  };
};

export interface RegisterOwnerPayload {
  storeName: string;
  ownerName: string;
  phone: string;
  password: string;
}

export const registerOwner = async (payload: RegisterOwnerPayload): Promise<AuthPayload> => {
  await delay(1500);

  const { storeName, ownerName, phone } = payload;

  return {
    user: {
      id: 'user_' + Date.now(),
      name: ownerName,
      phone,
      role: 'owner',
      storeId: 'store_' + Date.now(),
      storeName,
    },
    accessToken: 'mock_access_token_' + Date.now(),
  };
};

export interface RegisterStaffPayload {
  fullName: string;
  phone: string;
}

export const registerStaff = async (payload: RegisterStaffPayload): Promise<AuthPayload> => {
  await delay(1500);

  const { fullName, phone } = payload;

  return {
    user: {
      id: 'user_' + Date.now(),
      name: fullName,
      phone,
      role: 'staff',
      storeId: null,
      storeName: null,
    },
    accessToken: 'mock_access_token_' + Date.now(),
  };
};

export const sendOtp = async (phone: string): Promise<{ success: boolean }> => {
  await delay(1000);
  return { success: true };
};

export const verifyOtp = async (phone: string, otp: string): Promise<{ valid: boolean }> => {
  await delay(1000);
  return { valid: otp === '123456' || otp.length === 6 };
};

export const resetPassword = async (
  phone: string,
  otp: string,
  newPassword: string,
): Promise<{ success: boolean }> => {
  await delay(1000);
  return { success: true };
};
