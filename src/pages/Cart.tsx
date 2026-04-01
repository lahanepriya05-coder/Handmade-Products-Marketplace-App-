import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();

  const totalPrice = getTotalPrice();
  const taxAmount = Math.round(totalPrice * 0.1);
  const shippingAmount = totalPrice > 500 ? 0 : 50;
  const finalTotal = totalPrice + taxAmount + shippingAmount;

  const handleRemove = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Start adding some amazing handmade products!</p>
          <Button onClick={() => navigate('/products')} variant="primaryBlack">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.product.id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="h-32 w-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{item.product.artisan.name}</p>
                    <p className="text-orange-600 font-bold">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="ml-auto text-sm text-gray-600">
                        Subtotal: ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product.id, item.product.name)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </Card>
            ))}

            {/* Continue Shopping Button */}
            <Button
              onClick={() => navigate('/products')}
              variant="outline"
              className="w-full"
            >
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingAmount === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shippingAmount}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold">₹{taxAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold text-orange-600">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {shippingAmount > 0 && (
                <div className="mb-6 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                  Add ₹{(500 - totalPrice).toLocaleString('en-IN')} more for free shipping!
                </div>
              )}

              <Button
                onClick={handleCheckout}
                variant="primaryBlack"
                className="w-full mb-3"
                size="lg"
              >
                Place Order
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <p className="mb-3 text-center text-xs text-gray-500">
                This opens checkout where you confirm address and payment.
              </p>

              <Button
                onClick={() => clearCart()}
                variant="outline"
                className="w-full"
              >
                Clear Cart
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
