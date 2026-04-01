import { useParams, Link } from 'react-router-dom';
import { products } from '@/data/products';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { ShoppingCart, Heart, Star, MapPin, ChevronLeft, Truck, Shield, RefreshCw } from 'lucide-react';

interface ProductDetailProps {
  onAddToCart: (productId: string) => void;
}

export function ProductDetail({ onAddToCart }: ProductDetailProps) {
  const { id } = useParams<{ id: string }>();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product not found</h2>
          <Link to="/products">
            <Button variant="primaryBlack">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link to="/products" className="flex items-center text-gray-600 hover:text-orange-600 mb-6">
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-lg mb-4">
              <ImageWithFallback
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div>
            <Badge className="mb-4">{product.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-gray-500">({product.reviews} reviews)</span>
              </div>
              {product.inStock && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
              )}
            </div>

            <div className="mb-8">
              <span className="text-4xl font-bold text-orange-600">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Artisan Info */}
            <Card className="p-4 mb-8">
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={product.artisan.avatar}
                  alt={product.artisan.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-semibold">{product.artisan.name}</p>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{product.artisan.location}</span>
                  </div>
                </div>
                <Button variant="primaryBlack" size="sm" asChild>
                  <Link to={`/artisans/${product.artisan.id}`}>View Profile</Link>
                </Button>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                size="lg"
                variant="primaryBlack"
                className="flex-1"
                onClick={() => onAddToCart(product.id)}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <Truck className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-gray-500">On orders above ₹999</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <Shield className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-500">100% secure</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <RefreshCw className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-500">7 days return</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-4">Specifications</h3>
                <dl className="space-y-2">
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Category:</dt>
                    <dd className="font-medium">{product.category}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Handmade:</dt>
                    <dd className="font-medium">Yes</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Origin:</dt>
                    <dd className="font-medium">{product.artisan.location}</dd>
                  </div>
                  <div className="flex">
                    <dt className="w-32 text-gray-600">Artisan:</dt>
                    <dd className="font-medium">{product.artisan.name}</dd>
                  </div>
                </dl>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Care Instructions</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Handle with care</li>
                  <li>• Clean gently with soft cloth</li>
                  <li>• Store in cool, dry place</li>
                  <li>• Keep away from direct sunlight</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
