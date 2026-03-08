export type CustomerStatus =
  | "Đang hoạt động"
  | "Ngừng hoạt động"
  | "Khóa tài khoản";

// ── Customer Types ───────────────────────────────────────────
export interface Customer {
  id: string;
  name: string;
  code: string;
  phone: string;
  status: CustomerStatus;
}

// ── Mock Data ────────────────────────────────────────────────
export const customersMock: Customer[] = [
  {
    id: "1",
    name: "Nguyễn Văn Thành",
    code: "CUS00000035",
    phone: "0365416503",
    status: "Đang hoạt động",
  },
  {
    id: "2",
    name: "Trịnh Thành Đạt",
    code: "CUS00000031",
    phone: "0365416501",
    status: "Đang hoạt động",
  },
  {
    id: "3",
    name: "Lương Minh Trang",
    code: "CUS00000035",
    phone: "0365416503",
    status: "Ngừng hoạt động",
  },
  {
    id: "4",
    name: "Nguyễn Việt Nam",
    code: "CUS00000035",
    phone: "0365416503",
    status: "Đang hoạt động",
  },
  {
    id: "5",
    name: "Lê Trung Lương",
    code: "CUS00000035",
    phone: "0365416503",
    status: "Khóa tài khoản",
  },
  {
    id: "6",
    name: "Nguyễn Bá Trạc",
    code: "CUS00000035",
    phone: "0365416503",
    status: "Đang hoạt động",
  },
];
