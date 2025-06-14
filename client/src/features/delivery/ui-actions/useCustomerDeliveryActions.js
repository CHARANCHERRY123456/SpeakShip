// src/features/delivery/ui-actions/useCustomerDeliveryActions.js
export function useCustomerDeliveryActions({ setSearchTerm, setStatusFilter, setShowCreateForm, getMyDeliveries }) {
  const handleSearchChange = e => setSearchTerm(e.target.value);
  const handleStatusChange = e => setStatusFilter(e.target.value);
  const handleToggleCreateForm = () => setShowCreateForm(prev => !prev);
  const handleDeliveryCreated = () => {
    setShowCreateForm(false);
    getMyDeliveries();
  };
  return {
    handleSearchChange,
    handleStatusChange,
    handleToggleCreateForm,
    handleDeliveryCreated,
  };
}
