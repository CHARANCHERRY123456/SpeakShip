// src/features/delivery/utils/driverDeliveryFilters.js
export function filterDriverDeliveries(deliveries, searchTerm, status) {
  const searchLower = searchTerm.toLowerCase();
  return deliveries.filter(delivery => {
    const matchesStatus = !status || delivery.status === status;
    const customerName = delivery.name ? delivery.name.toLowerCase() : '';
    const driverName = (delivery.driver && typeof delivery.driver === 'object') ? (delivery.driver.name || delivery.driver.username || '').toLowerCase() : '';
    const matchesSearch =
      delivery.pickupAddress.toLowerCase().includes(searchLower) ||
      delivery.dropoffAddress.toLowerCase().includes(searchLower) ||
      customerName.includes(searchLower) ||
      driverName.includes(searchLower) ||
      delivery._id.toLowerCase().includes(searchLower);
    return matchesStatus && matchesSearch;
  });
}
