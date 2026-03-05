import type { DashboardData } from '../../../types';

export const mockDashboardData: DashboardData = {
  stats: {
    todayRevenue: '2,500,000đ',
    todayOrders: 15,
    monthRevenue: '45,000,000đ',
    monthOrders: 320,
  },
  recentOrders: [
    { id: '1', customer: 'Khách lẻ', total: '150,000đ', time: '10:30' },
    { id: '2', customer: 'Nguyễn Văn A', total: '250,000đ', time: '10:15' },
    { id: '3', customer: 'Khách lẻ', total: '80,000đ', time: '09:45' },
  ],
  topProducts: [
    { id: '1', name: 'Cà phê sữa', quantity: 45 },
    { id: '2', name: 'Trà đào', quantity: 38 },
    { id: '3', name: 'Sinh tố bơ', quantity: 25 },
  ],
};
