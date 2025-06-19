// Centralized orders feature constants
import { DELIVERY_API_ROUTES, STATUS_OPTIONS } from '../../delivery/constants';

export const ORDERS_API_ROUTES = {
  PENDING: DELIVERY_API_ROUTES.PENDING,
  ACCEPT: DELIVERY_API_ROUTES.ACCEPT,
};

export const PENDING_STATUS = STATUS_OPTIONS.find(opt => opt.label === 'Pending').value;
