import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Package, Truck } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

interface SellerOrderItem {
  productTitle: string;
  quantity: number;
  price: number;
}

interface SellerOrder {
  id: string;
  buyerName: string;
  buyerEmail: string;
  items: SellerOrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export function SellerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await apiClient.get('/api/seller/orders');
        setOrders(res.data.orders || []);
      } catch (error: any) {
        console.error('Failed to load seller orders', error);
        toast.error('Could not load seller orders', {
          description: error.response?.data?.message || error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const getStatusIcon = (status: SellerOrder['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/seller/dashboard')}
          className="mb-8 flex items-center gap-2 text-orange-600 hover:text-orange-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Seller Dashboard
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Seller Orders</h1>
          <p className="mt-2 text-gray-600">Track customer orders for your products and monitor fulfillment status.</p>
        </div>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="h-40 animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="mx-auto mb-4 h-20 w-20 text-gray-300" />
            <h2 className="mb-2 text-2xl font-bold">No Seller Orders Yet</h2>
            <p className="mb-6 text-gray-600">Once customers buy your products, their orders will show up here.</p>
            <Button onClick={() => navigate('/seller/dashboard')} className="bg-orange-600 hover:bg-orange-700">
              Go to Dashboard
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <Card key={order.id} className="p-6">
                <div className="mb-6 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="font-semibold">{order.id}</p>
                    <p className="mt-3 text-sm text-gray-500">Buyer</p>
                    <p className="font-medium">{order.buyerName}</p>
                    <p className="text-sm text-gray-600">{order.buyerEmail}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                      {getStatusIcon(order.status)}
                      {order.status}
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-orange-700">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div key={`${order.id}-${index}`} className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.productTitle}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
