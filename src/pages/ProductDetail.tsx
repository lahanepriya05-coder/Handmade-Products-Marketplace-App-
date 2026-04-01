import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { RatingStars } from '@/app/components/ui/RatingStars';
import { ProductDetailSkeleton } from '@/app/components/ui/LoadingSkeleton';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { fetchMarketplaceProductById, fetchMarketplaceProducts, MarketplaceProduct } from '@/services/marketplaceProducts';
import { toast } from 'sonner';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [product, setProduct] = useState<MarketplaceProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      setIsLoading(true);
      const [productData, allProducts] = await Promise.all([
        fetchMarketplaceProductById(id),
        fetchMarketplaceProducts(),
      ]);
      setProduct(productData);
      setRelatedProducts(
        allProducts
          .filter((item) => item.category === productData?.category && item.id !== productData?.id)
          .slice(0, 4)
      );
      setCurrentImageIndex(0);
      setIsLoading(false);
    };

    void loadProduct();
  }, [id]);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} item(s) to cart!`, {
      description: `${product.name} added successfully`,
    });
    setQuantity(1);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    toast.success('Added to cart, proceeding to checkout...', {
      description: 'Redirecting...',
    });
    setTimeout(() => navigate('/checkout'), 1000);
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-8 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-orange-600">
            Home
          </button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-orange-600">
            Products
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg overflow-hidden aspect-square">
              <ImageWithFallback
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {product.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {product.images.length}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      index === currentImageIndex ? 'border-orange-600' : 'border-gray-200'
                    }`}
                  >
                    <ImageWithFallback
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="mb-3">{product.category}</Badge>
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              <RatingStars rating={Math.round(product.rating)} reviews={product.reviews} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-orange-600">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-sm text-gray-600">Free shipping on orders above ₹500</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">About This Product</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.materials && (
              <div>
                <h3 className="font-semibold mb-2">Materials</h3>
                <div className="flex flex-wrap gap-2">
                  {product.materials.map((material) => (
                    <Badge key={material} variant="outline">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && (
              <div>
                <h3 className="font-semibold mb-2">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <Badge key={size} variant="outline">
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2">Quantity</h3>
              <div className="flex items-center border rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-6 py-2 border-l border-r">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleAddToCart} variant="primaryBlack" className="flex-1" size="lg">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button onClick={handleBuyNow} variant="outline" size="lg" className="flex-1">
                Buy Now
              </Button>
              <Button
                onClick={toggleWishlist}
                variant="ghost"
                size="lg"
                className={isInWishlist(product.id) ? 'text-red-600' : ''}
              >
                <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="ghost" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800">
                {product.inStock ? (
                  <>
                    <span className="font-semibold">In Stock</span> - Buyers can order this item now
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Out of Stock</span> - Available soon
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <Card className="p-6 bg-white">
          <h2 className="text-2xl font-bold mb-6">About the Seller</h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex items-center gap-4">
              <ImageWithFallback
                src={product.artisan.avatar}
                alt={product.artisan.name}
                className="h-24 w-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">{product.artisan.name}</h3>
                <p className="text-gray-600">{product.artisan.location}</p>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700 mb-4">
                This listing is part of the public marketplace, so buyers can open product details without logging in and
                discover products added by sellers across the platform.
              </p>
              <Button variant="primaryBlack" asChild>
                <Link to={`/artisans/${product.artisan.id}`}>View Seller Profile</Link>
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => navigate(`/product/${relatedProduct.id}`)}
                className="cursor-pointer group"
              >
                <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden mb-3">
                  <ImageWithFallback
                    src={relatedProduct.images[0]}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                </div>
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-orange-600">
                  {relatedProduct.name}
                </h3>
                <p className="text-orange-600 font-bold mt-2">
                  ₹{relatedProduct.price.toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
