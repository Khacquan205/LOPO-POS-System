// ── Notification Types ────────────────────────────────────────
export type NotificationType = 'order' | 'system' | 'promotion' | 'alert';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

// ── Mock Data ────────────────────────────────────────────────
export const notificationsMock: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Đơn hàng mới',
    message: 'Bạn có đơn hàng mới SO00000022 cần xử lý',
    createdAt: '2026-03-02T10:30:00.000Z',
    isRead: false,
  },
  {
    id: '2',
    type: 'system',
    title: 'Cập nhật hệ thống',
    message: 'LOPO POS đã cập nhật phiên bản 1.1.0 với nhiều tính năng mới',
    createdAt: '2026-03-02T09:00:00.000Z',
    isRead: true,
  },
  {
    id: '3',
    type: 'alert',
    title: 'Cảnh báo tồn kho',
    message: 'Sản phẩm "Bánh croissant" sắp hết hàng (còn 5)',
    createdAt: '2026-03-02T08:15:00.000Z',
    isRead: false,
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Khuyến mãi mới',
    message: 'Giảm 20% phí dịch vụ tháng 3/2026',
    createdAt: '2026-03-01T14:00:00.000Z',
    isRead: true,
  },
  {
    id: '5',
    type: 'order',
    title: 'Đơn hàng hoàn thành',
    message: 'Đơn hàng SO00000021 đã hoàn thành',
    createdAt: '2026-03-01T10:30:00.000Z',
    isRead: true,
  },
];

// ── Helpers ──────────────────────────────────────────────────
export const getUnreadCount = (notifications: Notification[]): number => {
  return notifications.filter((n) => !n.isRead).length;
};
