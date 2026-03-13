import { create } from "zustand";
import {
  customersMock,
  type Customer,
  type CustomerStatus,
} from "../mock/customers.mock";

interface AddCustomerPayload {
  name: string;
  phone: string;
  code: string;
  status: CustomerStatus;
}

interface UpdateCustomerPayload {
  id: string;
  name: string;
  phone: string;
  status: CustomerStatus;
}

interface CustomersState {
  customers: Customer[];
  addCustomer: (payload: AddCustomerPayload) => void;
  updateCustomer: (payload: UpdateCustomerPayload) => void;
  deleteCustomer: (id: string) => void;
  getNextCustomerCode: () => string;
}

const formatCustomerCode = (value: number): string => {
  return `CUS${value.toString().padStart(8, "0")}`;
};

export const useCustomersStore = create<CustomersState>((set, get) => ({
  customers: customersMock,

  addCustomer: ({ name, phone, code, status }) => {
    const newCustomer: Customer = {
      id: `${Date.now()}`,
      name,
      code,
      phone,
      status,
    };

    // Put newest customer on top so user can see it right away.
    set((state) => ({ customers: [newCustomer, ...state.customers] }));
  },

  updateCustomer: ({ id, name, phone, status }) => {
    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              name,
              phone,
              status,
            }
          : customer,
      ),
    }));
  },

  deleteCustomer: (id: string) => {
    set((state) => ({
      customers: state.customers.filter((customer) => customer.id !== id),
    }));
  },

  getNextCustomerCode: () => {
    const maxCode = get().customers.reduce((max, customer) => {
      const numeric = Number(customer.code.replace("CUS", ""));
      return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
    }, 0);

    return formatCustomerCode(maxCode + 1);
  },
}));
