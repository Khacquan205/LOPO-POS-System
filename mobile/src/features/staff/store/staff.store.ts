import { create } from "zustand";
import {
  staffMock,
  Staff,
  approvalMock,
  StaffApproval,
  ApprovalStatus,
} from "../mock/staff.mock";

interface StaffState {
  staffList: Staff[];
  approvalList: StaffApproval[];
  addStaff: (data: Pick<Staff, "name" | "phone" | "isActive">) => void;
  updateStaff: (
    id: string,
    data: Partial<Pick<Staff, "name" | "phone" | "isActive">>,
  ) => void;
  removeStaff: (id: string) => void;
  setApprovalStatus: (id: string, status: ApprovalStatus) => void;
  blockApproval: (id: string) => void;
}

let nextId = staffMock.length + 1;

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

export const useStaffStore = create<StaffState>((set) => ({
  staffList: staffMock,
  approvalList: approvalMock,

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
