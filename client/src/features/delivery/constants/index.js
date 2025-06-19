// Centralized delivery feature constants
import { GLOBAL_MESSAGES } from '../../../constants/globalConstants';

export const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Accepted', label: 'Accepted' },
  { value: 'In-Transit', label: 'In-Transit' },
  { value: 'Delivered', label: 'Delivered' },
];

export const DELIVERY_MESSAGES = {
  notCustomer: 'You must be logged in as a customer to view this page.',
  noDeliveries: 'No delivery requests found.',
  error: GLOBAL_MESSAGES.GENERIC_ERROR,
};

export const DELIVERY_API_ROUTES = {
  CREATE: '/api/delivery/create',
  PENDING: '/api/delivery/pending',
  ACCEPT: '/api/delivery/accept',
  STATUS: '/api/delivery/status',
  MY: '/api/delivery/my',
  CUSTOMER: '/api/delivery/customer',
};
