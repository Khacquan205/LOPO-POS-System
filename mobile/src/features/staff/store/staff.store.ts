import { create } from "zustand";
import {
  Staff,
  approvalMock,
  StaffApproval,
  ApprovalStatus,
} from "../mock/staff.mock";
import { ApiError } from "../../../lib/api/client";
import { getOwnerStaffList } from "../services/staff.service";

interface StaffState {
  staffList: Staff[];
  isLoading: boolean;
  errorMessage: string | null;
  approvalList: StaffApproval[];
  fetchStaffList: (accessToken: string) => Promise<void>;
  clearError: () => void;
  addStaff: (data: Pick<Staff, "name" | "phone" | "isActive">) => void;
  updateStaff: (
    id: string,
    data: Partial<Pick<Staff, "name" | "phone" | "isActive">>,
  ) => void;
  removeStaff: (id: string) => void;
  setApprovalStatus: (id: string, status: ApprovalStatus) => void;
  blockApproval: (id: string) => void;
}

let nextId = 1;

const pad = (n: number): string => String(n).padStart(8, "0");

const nowString = (): string => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
};

const formatDisplayDateTime = (iso: string): string => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
};

const buildStaffCode = (id: string): string => {
  const normalized = id.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `ST${normalized.slice(-8).padStart(8, "0")}`;
};

const normalizeRole = (role: string): Staff["role"] => {
  if (role === "owner" || role === "manager" || role === "cashier" || role === "staff") {
    return role;
  }
  return "staff";
};

export const useStaffStore = create<StaffState>((set) => ({
  staffList: [],
  isLoading: false,
  errorMessage: null,
  approvalList: approvalMock,

  fetchStaffList: async (accessToken) => {
    if (!accessToken) {
      set({ errorMessage: "Vui lòng đăng nhập để tải danh sách nhân viên" });
      return;
    }

    set({ isLoading: true, errorMessage: null });
    try {
      const list = await getOwnerStaffList(accessToken);
      const mapped: Staff[] = list.map((item) => ({
        id: item.user_id,
        staffCode: buildStaffCode(item.user_id),
        name: item.full_name,
        phone: item.phone_number,
        role: normalizeRole(item.role),
        isActive: item.status === "active",
        createdAt: formatDisplayDateTime(item.createdAt),
      }));

      nextId = mapped.length + 1;
      set({ staffList: mapped, isLoading: false, errorMessage: null });
    } catch (error) {
      let message = "Không thể tải danh sách nhân viên";
      if (error instanceof ApiError) {
        if (error.statusCode === 401 || error.statusCode === 422) {
          message = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại";
        } else if (error.statusCode === 403) {
          message = "Bạn không có quyền xem danh sách nhân viên hoặc chưa liên kết cửa hàng";
        } else {
          message = error.message || message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ isLoading: false, errorMessage: message });
    }
  },

  clearError: () => set({ errorMessage: null }),

  addStaff: (data) =>
    set((state) => {
      const id = String(nextId++);
      const newStaff: Staff = {
        id,
        staffCode: `ST${pad(Number(id))}`,
        role: "staff",
        createdAt: nowString(),
        ...data,
      };
      return { staffList: [newStaff, ...state.staffList] };
    }),

  updateStaff: (id, data) =>
    set((state) => ({
      staffList: state.staffList.map((s) =>
        s.id === id ? { ...s, ...data } : s,
      ),
    })),

  removeStaff: (id) =>
    set((state) => ({
      staffList: state.staffList.filter((s) => s.id !== id),
    })),

  setApprovalStatus: (id, status) =>
    set((state) => ({
      approvalList: state.approvalList.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              rejectedCount:
                status === "rejected" ? a.rejectedCount + 1 : a.rejectedCount,
            }
          : a,
      ),
    })),

  blockApproval: (id) =>
    set((state) => ({
      approvalList: state.approvalList.map((a) =>
        a.id === id ? { ...a, status: "blocked" } : a,
      ),
    })),
}));
