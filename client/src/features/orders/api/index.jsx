// Service layer for orders (driver deliveries)
import axios from '../../../api/axios';
import { ORDERS_API_ROUTES, PENDING_STATUS } from '../constants';

export const fetchPendingDeliveries = async (params = {}) => {
  // params: { page, limit, search }
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.search) searchParams.append('search', params.search);
  // Always filter by pending status
  searchParams.append('status', PENDING_STATUS);
  const res = await axios.get(`${ORDERS_API_ROUTES.PENDING}?${searchParams.toString()}`);
  return res.data;
};

export const acceptDelivery = async (deliveryId) => {
  const res = await axios.post(`${ORDERS_API_ROUTES.ACCEPT}/${deliveryId}`);
  return res.data;
};
