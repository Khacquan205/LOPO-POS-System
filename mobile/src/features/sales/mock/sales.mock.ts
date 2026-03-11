import { ordersMock } from '../../orders/mock/orders.mock';

// ── Generate a new unique order code ─────────────────────────
export const generateNewOrderCode = (): string => {
  const maxId = ordersMock.reduce((max, o) => Math.max(max, parseInt(o.id, 10)), 0);
  return `SO${String(maxId + 1).padStart(7, '0')}`;
};

export const generateNewOrderId = (): string => {
  const maxId = ordersMock.reduce((max, o) => Math.max(max, parseInt(o.id, 10)), 0);
  return String(maxId + 1);
};
