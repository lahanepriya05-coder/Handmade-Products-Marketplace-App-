import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
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

export function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      const localOrders: Order[] = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
      const localMatch = localOrders.find((item) => item.id === id);

      try {
        const res = await apiClient.get('/api/orders/my');
        const allOrders: Order[] = [ ...(res.data.orders || []), ...localOrders ];
        setOrder(allOrders.find((item) => item.id === id) || localMatch || null);
      } catch {
        setOrder(localMatch || null);
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [id]);

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
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const steps: Array<{ key: Order['status']; label: string }> = [
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getStepIndex = (status: Order['status']) => {
    if (status === 'cancelled') return -1;
    return steps.findIndex((step) => step.key === status);
  };

  if (!isLoading && !order) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/orders')}
          className="mb-8 flex items-center gap-2 text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </button>

        {isLoading || !order ? (
          <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="p-6">
              <h1 className="mb-6 text-3xl font-bold">Track Order</h1>
              <div className="mb-6 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="font-semibold">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              <div className="mb-8 rounded-xl border bg-white p-4">
                <div className="mb-3 flex items-center gap-2">
                  {getStatusIcon(order.status)}
                  <p className="font-semibold capitalize">{order.status}</p>
                </div>
                <p className="text-sm text-gray-600">
                  Your order is currently marked as <span className="font-medium capitalize">{order.status}</span>.
                </p>
              </div>

              <div className="mb-8 rounded-xl border bg-white p-5">
                <h2 className="mb-5 text-lg font-semibold">Order Progress</h2>
                {order.status === 'cancelled' ? (
                  <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    This order has been cancelled.
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-3">
                    {steps.map((step, index) => {
                      const activeIndex = getStepIndex(order.status);
                      const isCompleted = index <= activeIndex;
                      const isCurrent = index === activeIndex;

                      return (
                        <div key={step.key} className="text-center">
                          <div
                            className={`mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-bold ${
                              isCompleted
                                ? 'border-orange-600 bg-orange-600 text-white'
                                : 'border-gray-300 bg-white text-gray-400'
                            }`}
                          >
                            {index + 1}
                          </div>
                          <p className={`text-sm font-medium ${isCurrent ? 'text-orange-700' : 'text-gray-600'}`}>
                            {step.label}
                          </p>
                          {index < steps.length - 1 && (
                            <div
                              className={`mx-auto mt-3 h-1 w-full rounded-full ${
                                index < activeIndex ? 'bg-orange-600' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <h2 className="mb-4 text-xl font-semibold">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={`${order.id}-${index}`} className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="font-semibold">{item.productTitle}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Buyer</span>
                  <span className="font-medium">{order.buyerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium">{order.buyerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-orange-600">₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="primaryBlack" className="w-full" onClick={() => navigate('/products')}>
                  Continue Shopping
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
