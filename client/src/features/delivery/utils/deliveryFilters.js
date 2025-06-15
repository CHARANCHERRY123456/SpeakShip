// src/features/delivery/utils/deliveryFilters.js
// This file is now obsolete. Filtering is handled by the backend. You can delete this file.
// export function filterDeliveries(deliveries, searchTerm, status) {
//   const searchLower = searchTerm.toLowerCase();
//   return deliveries.filter(delivery => {
//     const matchesStatus = !status || delivery.status === status;
//     const matchesSearch =
//       delivery.pickupAddress.toLowerCase().includes(searchLower) ||
//       delivery.dropoffAddress.toLowerCase().includes(searchLower) ||
//       (delivery.name && delivery.name.toLowerCase().includes(searchLower)) ||
//       delivery._id.toLowerCase().includes(searchLower);
//     return matchesStatus && matchesSearch;
//   });
// }
