import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MapPin, Mail, Package, ArrowLeft } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card } from '@/app/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/services/apiClient';
import { toast } from 'sonner';

const LOCAL_ORDERS_KEY = 'kinara_local_orders';

export function Checkout() {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkoutFormRef = useRef<HTMLFormElement | null>(null);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  const totalPrice = getTotalPrice();
  const taxAmount = Math.round(totalPrice * 0.1);
  const shippingAmount = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + taxAmount + shippingAmount;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      const message = 'Please fill in all checkout fields before placing the order.';
      setFormError(message);
      toast.error(message);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      buyerName: `${formData.firstName} ${formData.lastName}`.trim(),
      buyerEmail: formData.email,
      items: cartItems.map((item) => ({
        productTitle: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      })),
      total: finalTotal,
      shippingAddress: {
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
    };

    try {
      await apiClient.post('/api/orders', payload);
      toast.success('Order placed successfully!', {
        description: 'Your order has been confirmed. You will receive a confirmation email shortly.',
      });
      clearCart();
      setTimeout(() => navigate('/orders'), 1500);
    } catch (error: any) {
      const fallbackOrder = {
        id: `LOCAL-${Date.now()}`,
        createdAt: new Date().toISOString(),
        buyerName: payload.buyerName,
        buyerEmail: payload.buyerEmail,
        items: payload.items,
        total: payload.total,
        status: 'pending' as const,
      };

      try {
        const existing = JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
        localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([fallbackOrder, ...existing]));
        setFormError('');

        toast.success('Order placed in demo mode!', {
          description: error?.response?.data?.message || 'Server was unavailable, so the order was saved locally.',
        });

        clearCart();
        setTimeout(() => navigate('/orders'), 1500);
      } catch {
        setFormError(error?.response?.data?.message || error?.message || 'Order could not be placed.');
        toast.error('Order failed', {
          description: error?.response?.data?.message || error?.message || 'Please try again',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--kinara-cream)' }}>
        <div className="text-center">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>Cart is Empty</h1>
          <p style={{ color: 'var(--kinara-text-medium)', marginBottom: '1.5rem' }}>Add products before checking out</p>
          <Button onClick={() => navigate('/products')} className="text-white" style={{ backgroundColor: 'var(--kinara-brown-primary)' }}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: 'var(--kinara-cream)' }}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </button>

        <h1 className="text-3xl font-bold mb-8" style={{ color: 'var(--kinara-brown-primary)' }}>Checkout</h1>

        <div className="mb-6 lg:hidden">
          <Button
            type="button"
            onClick={() => checkoutFormRef.current?.requestSubmit()}
            variant="primaryBlack"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : `Place Order - ₹${finalTotal.toLocaleString('en-IN')}`}
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card className="p-6 card" style={{ backgroundColor: 'var(--kinara-white)' }}>
              <form ref={checkoutFormRef} onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {formError}
                  </div>
                )}
                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>

                  <Input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-4"
                  />

                  <Input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-4"
                  />

                  <Input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-4"
                  />

                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <Input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={formData.city}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={formData.state}
                      onChange={handleChange}
                    />
                    <Input
                      type="text"
                      name="pincode"
                      placeholder="Pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t"></div>

                {/* Delivery Options */}
                <div>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Delivery Options
                  </h2>

                  <div className="space-y-3">
                    <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="delivery" value="standard" defaultChecked />
                      <span className="ml-3">
                        <span className="font-semibold">Standard Delivery</span>
                        <span className="text-gray-600 text-sm block">5-7 business days</span>
                      </span>
                    </label>
                    <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="delivery" value="express" />
                      <span className="ml-3">
                        <span className="font-semibold">Express Delivery</span>
                        <span className="text-gray-600 text-sm block">2-3 business days - +₹100</span>
                      </span>
                    </label>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t"></div>

                {/* Payment Method */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Payment Method</h2>

                  <div className="space-y-3">
                    <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="card" defaultChecked />
                      <span className="ml-3 font-semibold">Credit/Debit Card</span>
                    </label>
                    <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="upi" />
                      <span className="ml-3 font-semibold">UPI</span>
                    </label>
                    <label className="flex items-center border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="payment" value="cod" />
                      <span className="ml-3 font-semibold">Cash on Delivery</span>
                    </label>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  type="submit"
                  variant="primaryBlack"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Place Order - ₹${finalTotal.toLocaleString('en-IN')}`}
                </Button>
              </form>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6 sticky top-8 card" style={{ backgroundColor: 'var(--kinara-white)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--kinara-brown-primary)' }}>Order Summary</h2>

              <div className="space-y-4 mb-6 pb-6 border-b max-h-96 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-semibold line-clamp-1">{item.product.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingAmount === 0 ? <span className="text-green-600">FREE</span> : `₹${shippingAmount}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold" style={{ color: 'var(--kinara-brown-primary)' }}>
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="mb-6">
                <p className="mb-3 text-sm font-medium text-gray-700">Ready to place your order?</p>
                <Button
                  type="button"
                  variant="primaryBlack"
                  className="w-full"
                  size="lg"
                  onClick={() => checkoutFormRef.current?.requestSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : `Place Order - ₹${finalTotal.toLocaleString('en-IN')}`}
                </Button>
              </div>

              {/* Trust Badge */}
              <div className="p-4 bg-green-50 rounded-lg text-sm text-green-800 space-y-2">
                <p className="font-semibold">✓ 100% Secure</p>
                <p>✓ Safe & Encrypted</p>
                <p>✓ Authentic Products</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
