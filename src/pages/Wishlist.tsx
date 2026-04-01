import { useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowRight, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { RatingStars } from '@/app/components/ui/RatingStars';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

export function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = (productName: string, productId: string) => {
    removeFromWishlist(productId);
    toast.info(`${productName} removed from wishlist`);
  };

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
    toast.success(`${product.name} moved to cart!`);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Add your favorite handmade products to get started!</p>
          <Button onClick={() => navigate('/products')} variant="primaryBlack">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist ({wishlistItems.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition">
              {/* Image Container */}
              <div className="relative aspect-square bg-gray-200 overflow-hidden group">
                <ImageWithFallback
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />

                {/* Remove Button */}
                <button
                  onClick={() => handleRemove(product.name, product.id)}
                  className="absolute top-3 right-3 bg-white/90 hover:bg-white p-2 rounded-full transition"
                >
                  <X className="h-5 w-5 text-red-600" />
                </button>

                {/* Badge */}
                <div className="absolute top-3 left-3 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {product.category}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                {/* Name */}
                <h3 className="font-semibold text-lg line-clamp-2 hover:text-orange-600 cursor-pointer transition"
                    onClick={() => navigate(`/product/${product.id}`)}>
                  {product.name}
                </h3>

                {/* Artisan */}
                <p className="text-sm text-gray-600">{product.artisan.name}</p>

                {/* Rating */}
                <RatingStars rating={Math.round(product.rating)} reviews={product.reviews} />

                {/* Price */}
                <p className="text-2xl font-bold text-orange-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>

                {/* Stock Status */}
                <p className={`text-sm font-semibold ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handleMoveToCart(product)}
                    variant="primaryBlack"
                    className="flex-1"
                    size="sm"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    onClick={() => navigate(`/product/${product.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button onClick={() => navigate('/products')} variant="outline" size="lg">
            Continue Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
