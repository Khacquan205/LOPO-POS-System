import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { OrderStatusApi } from "../features/orders/types/order.types";

// ── Shared param types ───────────────────────────────────────
export type PickedItem = {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
};

export type UpdatedItem = {
  itemId: string;
  qty: number;
};

export type LiveOrderPayload = {
  code: string;
  status?: OrderStatusApi;
  createdAt?: string;
  staffName?: string;
  items: {
    id: string;
    productName: string;
    unitPrice: number;
    quantity: number;
  }[];
  customer?: { name: string; phone?: string };
  total: number;
};

// ── Auth Stack ───────────────────────────────────────────────
export type AuthStackParamList = {
  Login: undefined;
  RegisterSelectRole: undefined;
  RegisterOwner: undefined;
  RegisterStaff: undefined;
  ForgotPasswordPhone: undefined;
  ForgotPasswordOtp: { phone: string };
  ForgotPasswordReset: { phone: string; otp: string };
};

// ── Main Tabs ────────────────────────────────────────────────
export type MainTabsParamList = {
  Home: undefined;
};

// ── Main Stack (feature screens) ─────────────────────────────
export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  Orders: undefined;
  DraftOrderDetail: {
    orderId: string;
    pickedItems?: PickedItem[];
    updatedItem?: UpdatedItem;
  };
  OrderBillReadOnly: { orderId: string };
  OrderSummary: {
    orderId?: string;
    fromDraft?: boolean;
    liveOrder?: LiveOrderPayload;
  };
  Payment: {
    orderCode: string;
    orderId?: string;
    total: number;
    status?: OrderStatusApi;
    createdAt?: string;
    staffName?: string;
    items?: {
      id: string;
      productName: string;
      unitPrice: number;
      quantity: number;
    }[];
    customer?: { name: string; phone?: string };
  };
  Sales: { pickedItems?: PickedItem[]; updatedItem?: UpdatedItem; draftOrderId?: string; source?: 'sales' | 'orders' } | undefined;
  ProductPicker: {
    orderId: string;
    returnScreen: "Sales" | "DraftOrderDetail";
  };
  ScanProduct: {
    returnScreen: "Sales" | "DraftOrderDetail";
    orderId?: string;
  };
  QuantityEditor: {
    orderId: string;
    itemId: string;
    productName: string;
    unitPrice: number;
    currentQty: number;
    returnScreen: "Sales" | "DraftOrderDetail";
  };
  Products: { showDeleteSuccessToast?: boolean } | undefined;
  CreateProduct: undefined;
  ProductDetail: { productId: string; edited?: boolean };
  EditProduct: { productId: string };
  Customers:
    | {
        showCreateSuccessToast?: boolean;
        successMessage?: string;
      }
    | undefined;
  CreateCustomer: undefined;
  EditCustomer: { customerId: string };
  CustomerDetail: { customerId: string };
  PurchaseHistory: { customerId: string; customerCode: string };
  Staff: undefined;
  StaffDetail: { staffId: string };
  EditStaff: { staffId: string };
  CreateStaff: undefined;
  StaffApproval: undefined;
  StaffApprovalDetail: { approvalId: string };
  Settings: undefined;
  Support: undefined;
  Notifications: undefined;
  StoreSelector: undefined;
};

// ── Root Stack ───────────────────────────────────────────────
export type RootStackParamList = {
  Intro: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// ── Screen props helpers ─────────────────────────────────────
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabsParamList> =
  BottomTabScreenProps<MainTabsParamList, T>;

export type MainStackScreenProps<T extends keyof MainStackParamList> =
  NativeStackScreenProps<MainStackParamList, T>;

export type RootScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
