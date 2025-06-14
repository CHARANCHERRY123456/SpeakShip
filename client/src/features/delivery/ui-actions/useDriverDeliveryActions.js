// src/features/delivery/ui-actions/useDriverDeliveryActions.js
export function useDriverDeliveryActions({ setSearchTerm, setStatusFilter, handleAcceptDelivery, handleUpdateDeliveryStatus, getPendingDeliveries, getMyAssignedDeliveries }) {
  const handleSearchChange = e => setSearchTerm(e.target.value);
  const handleStatusChange = e => setStatusFilter(e.target.value);
  const onAcceptDelivery = async (deliveryId) => {
    const accepted = await handleAcceptDelivery(deliveryId);
    if (accepted) {
      getPendingDeliveries();
      getMyAssignedDeliveries();
    }
  };
  const onUpdateStatus = async (deliveryId, newStatus) => {
    await handleUpdateDeliveryStatus(deliveryId, newStatus);
    // The hook updates its internal state, which triggers the filtering useEffect
  };
  return {
    handleSearchChange,
    handleStatusChange,
    onAcceptDelivery,
    onUpdateStatus,
    getPendingDeliveries
  };
}
