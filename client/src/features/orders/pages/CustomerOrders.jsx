// src/features/orders/pages/OrdersPage.jsx
import CreateDeliveryForm from '../../delivery/components/CreateDeliveryForm/CreateDeliveryForm';
import { useAuth } from '../../../contexts/AuthContext';

const CustomerOrdersPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="text-center py-12 text-red-600 font-semibold text-lg">
        Please log in to view your orders.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        {currentUser?.role === 'customer' ? 'Create New Order' : 'Order Management'}
      </h1>
      
      {currentUser?.role === 'customer' && (
        <div className="max-w-4xl mx-auto">
          <CreateDeliveryForm />
        </div>
      )}
      
      
    </div>
  );
};

export default CustomerOrdersPage;