import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";

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
  Sales: undefined;
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
