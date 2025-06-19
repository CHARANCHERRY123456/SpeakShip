// src/features/orders/pages/OrdersPage.jsx
import CreateDeliveryForm from '../../delivery/components/CreateDeliveryForm';
import { useAuth } from '../../../contexts/AuthContext';

const OrdersPage = () => {
  const { currentUser } = useAuth();

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

export default OrdersPage;