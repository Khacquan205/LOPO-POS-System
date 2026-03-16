import { create } from "zustand";
import {
  Staff,
  approvalMock,
  StaffApproval,
  ApprovalStatus,
} from "../mock/staff.mock";
import { ApiError } from "../../../lib/api/client";
import {
  getOwnerStaffList,
  getPendingJoinRequests,
  approveJoinRequest,
  rejectJoinRequest,
  updateStaffStatus,
  deleteStaff as apiDeleteStaff,
} from "../services/staff.service";

interface StaffState {
  staffList: Staff[];
  isLoading: boolean;
  errorMessage: string | null;
  approvalList: StaffApproval[];
  isApprovalLoading: boolean;
  approvalErrorMessage: string | null;
  fetchStaffList: (accessToken: string) => Promise<void>;
  fetchPendingApprovals: (accessToken: string) => Promise<void>;
  approvePendingRequest: (accessToken: string, requestId: string) => Promise<void>;
  rejectPendingRequest: (accessToken: string, requestId: string) => Promise<void>;
  clearError: () => void;
  clearApprovalError: () => void;
  addStaff: (data: Pick<Staff, "name" | "phone" | "isActive">) => void;
  updateStaff: (
    id: string,
    data: Partial<Pick<Staff, "name" | "phone" | "isActive">>,
  ) => void;
  removeStaff: (id: string) => void;
  updateStaffStatusApi: (accessToken: string, staffId: string, status: 'active' | 'inactive') => Promise<void>;
  deleteStaffApi: (accessToken: string, staffId: string) => Promise<void>;
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

const normalizeApprovalStatus = (status?: string): ApprovalStatus => {
  if (status === "approved" || status === "rejected" || status === "blocked") {
    return status;
  }
  return "pending";
};

export const useStaffStore = create<StaffState>((set) => ({
  staffList: [],
  isLoading: false,
  errorMessage: null,
  approvalList: approvalMock,
  isApprovalLoading: false,
  approvalErrorMessage: null,

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

  fetchPendingApprovals: async (accessToken) => {
    if (!accessToken) {
      set({ approvalErrorMessage: "Vui lòng đăng nhập để tải danh sách chờ duyệt" });
      return;
    }

    set({ isApprovalLoading: true, approvalErrorMessage: null });
    try {
      const list = await getPendingJoinRequests(accessToken);
      const mapped: StaffApproval[] = list.map((item, index) => {
        const rawId = item.request_id || String(index + 1);
        const staffUserId = item.staff_user_id || rawId;
        const rejectedCount = Number(item.rejected_count ?? 0);
        const createdAtIso = item.requested_at || item.createdAt || item.updatedAt || "";

        return {
          id: rawId,
          staffCode: buildStaffCode(staffUserId),
          name: item.staff_full_name?.trim() || "Nhân viên",
          phone: item.staff_phone_number?.trim() || "",
          createdAt: createdAtIso ? formatDisplayDateTime(createdAtIso) : nowString(),
          status: normalizeApprovalStatus(item.status),
          rejectedCount: Number.isFinite(rejectedCount) ? rejectedCount : 0,
        };
      });

      set({ approvalList: mapped, isApprovalLoading: false, approvalErrorMessage: null });
    } catch (error) {
      let message = "Không thể tải danh sách chờ duyệt";
      if (error instanceof ApiError) {
        if (error.statusCode === 401 || error.statusCode === 422) {
          message = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại";
        } else if (error.statusCode === 403) {
          message = "Bạn không có quyền owner để duyệt yêu cầu tham gia";
        } else if (error.statusCode === 404) {
          message = "Không tìm thấy cửa hàng của owner";
        } else {
          message = error.message || message;
        }
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ isApprovalLoading: false, approvalErrorMessage: message });
    }
  },

  clearApprovalError: () => set({ approvalErrorMessage: null }),

  approvePendingRequest: async (accessToken, requestId) => {
    if (!accessToken) {
      throw new Error("Vui lòng đăng nhập để duyệt yêu cầu");
    }
    if (!requestId) {
      throw new Error("Thiếu request id để duyệt yêu cầu");
    }

    try {
      await approveJoinRequest(accessToken, requestId);
      set((state) => ({
        approvalList: state.approvalList.filter((a) => a.id !== requestId),
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 400) {
          throw new Error("Yêu cầu không còn ở trạng thái chờ duyệt");
        }
        if (error.statusCode === 401 || error.statusCode === 422) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        }
        if (error.statusCode === 403) {
          throw new Error("Bạn không có quyền owner để duyệt yêu cầu");
        }
        if (error.statusCode === 404) {
          throw new Error("Không tìm thấy yêu cầu hoặc cửa hàng");
        }
        if (error.statusCode === 409) {
          throw new Error("Nhân viên đã thuộc cửa hàng khác");
        }
        throw new Error(error.message || "Không thể duyệt yêu cầu tham gia");
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Không thể duyệt yêu cầu tham gia");
    }
  },

  rejectPendingRequest: async (accessToken, requestId) => {
    if (!accessToken) {
      throw new Error("Vui lòng đăng nhập để từ chối yêu cầu");
    }
    if (!requestId) {
      throw new Error("Thiếu request id để từ chối yêu cầu");
    }

    try {
      await rejectJoinRequest(accessToken, requestId);
      set((state) => ({
        approvalList: state.approvalList.filter((a) => a.id !== requestId),
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.statusCode === 400) {
          throw new Error("Yêu cầu không còn ở trạng thái chờ duyệt");
        }
        if (error.statusCode === 401 || error.statusCode === 422) {
          throw new Error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại");
        }
        if (error.statusCode === 403) {
          throw new Error("Bạn không có quyền owner để từ chối yêu cầu");
        }
        if (error.statusCode === 404) {
          throw new Error("Không tìm thấy yêu cầu hoặc cửa hàng");
        }
        throw new Error(error.message || "Không thể từ chối yêu cầu tham gia");
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Không thể từ chối yêu cầu tham gia");
    }
  },

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

  updateStaffStatusApi: async (accessToken, staffId, status) => {
    const updated = await updateStaffStatus(accessToken, staffId, status);
    set((state) => ({
      staffList: state.staffList.map((s) =>
        s.id === staffId ? { ...s, isActive: updated.status === 'active' } : s,
      ),
    }));
  },

  deleteStaffApi: async (accessToken, staffId) => {
    await apiDeleteStaff(accessToken, staffId);
    set((state) => ({
      staffList: state.staffList.filter((s) => s.id !== staffId),
    }));
  },

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
