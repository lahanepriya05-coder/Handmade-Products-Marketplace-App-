import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Truck, Package, ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/apiClient';

const LOCAL_ORDERS_KEY = 'kinara_local_orders';

interface OrderItem {
  productTitle: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  createdAt: string;
  buyerName: string;
  buyerEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

export function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const localOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');

      try {
        const res = await apiClient.get('/api/orders/my');
        setOrders([...(res.data.orders || []), ...localOrders]);
      } catch (error) {
        console.error('Failed to load orders', error);
        setOrders(localOrders);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <div className="h-5 w-5 text-red-500 border-2 border-red-500 rounded-full" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    };
    return labels[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      pending: 'text-yellow-700 bg-yellow-50',
      processing: 'text-blue-700 bg-blue-50',
      shipped: 'text-purple-700 bg-purple-50',
      delivered: 'text-green-700 bg-green-50',
      cancelled: 'text-red-700 bg-red-50',
    };
    return colors[status];
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Please Log In</h1>
          <p className="text-gray-600 mb-6">You need to be logged in to view your orders</p>
          <Button onClick={() => navigate('/login')} className="bg-orange-600 hover:bg-orange-700">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-gray-600">Welcome, {user.name}! Here are your orders.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Button onClick={() => navigate('/products')} className="bg-orange-600 hover:bg-orange-700">
              Start Shopping
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="grid lg:grid-cols-2 gap-6 mb-6 pb-6 border-b">
                  {/* Order Info */}
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Order Number</p>
                      <p className="text-lg font-bold">{order.id}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="text-lg font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-start lg:justify-end">
                    <div className="text-center">
                      <div className="flex justify-center mb-3">
                        {getStatusIcon(order.status)}
                      </div>
                      <p className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-6 pb-6 border-b">
                  <h3 className="font-bold mb-4">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productTitle}`} className="flex justify-between text-sm">
                        <div>
                          <p className="font-semibold">{item.productTitle}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-600 mb-2">Total Amount</p>
                    <p className="text-2xl font-bold text-orange-600">
                      ₹{order.total.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-x-3 flex">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Track Order
                    </Button>
                    {order.status === 'delivered' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          /* Return/Exchange logic */
                        }}
                      >
                        Return
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
