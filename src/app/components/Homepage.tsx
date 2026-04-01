import { ArrowRight, Sparkles, Users, Shield, Heart } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ProductCard } from '@/app/components/ProductCard';
import { Link, useNavigate } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { useEffect, useState } from 'react';
import { fetchMarketplaceProducts, MarketplaceProduct } from '@/services/marketplaceProducts';

export function Homepage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<MarketplaceProduct[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await fetchMarketplaceProducts();
      setFeaturedProducts(allProducts.slice(0, 6));
    };

    void loadProducts();
  }, []);

  const categoryCards = [
    { name: 'Sarees', icon: '🧵' },
    { name: 'Kurtas & Kurtis', icon: '👕' },
    { name: 'Lehengas', icon: '👗' },
    { name: 'Salwar Suits', icon: '🎀' },
    { name: 'Dupattas & Stoles', icon: '🪡' },
    { name: 'Dresses', icon: '✨' },
  ];

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/products?category=${categoryName}`);
  };

  return (
    <div className="min-h-screen">
      <section className="relative" style={{ backgroundColor: '#ffffff', paddingTop: '5rem', paddingBottom: '6rem' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight" style={{ color: 'var(--kinara-brown-primary)', fontFamily: 'Georgia, serif' }}>
                Discover Authentic
                <span className="block" style={{ color: 'var(--kinara-gold)' }}>Handmade Clothing</span>
              </h1>
              <p className="text-lg mb-8" style={{ color: 'var(--kinara-text-medium)' }}>
                Connect directly with talented artisans and sellers across India. Every purchase supports small entrepreneurs and preserves traditional textile craftsmanship.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Button
                  size="lg"
                  variant="primaryBlack"
                  onClick={() => navigate('/products')}
                >
                  Explore Products
                </Button>
                <Button
                  size="lg"
                  variant="primaryBlack"
                  onClick={() => navigate('/artisans')}
                >
                  Meet Artisans
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-xl)' }}>
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1742287721821-ddf522b3f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NzAxMjgzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Handmade clothing"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl" style={{ boxShadow: 'var(--shadow-lg)' }}>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-peach-50 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--kinara-peach-light)' }}>
                    <Sparkles className="h-6 w-6" style={{ color: 'var(--kinara-brown-primary)' }} />
                  </div>
                  <div>
                    <p className="font-semibold">100% Handcrafted</p>
                    <p className="text-sm" style={{ color: 'var(--kinara-text-medium)' }}>Authentic Clothing</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--kinara-white)' }}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-peach-50 flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--kinara-peach-light)' }}>
                <Users className="h-8 w-8" style={{ color: 'var(--kinara-brown-primary)' }} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Direct from Sellers</h3>
              <p style={{ color: 'var(--kinara-text-medium)' }}>
                Buy directly from skilled creators and sellers, with new marketplace listings appearing automatically.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Every garment is handcrafted with care using traditional techniques and premium fabrics.
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Support Local</h3>
              <p className="text-gray-600">
                Empower small artisans and help preserve traditional textile arts and weaving techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--kinara-cream)' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>Featured Products</h2>
              <p style={{ color: 'var(--kinara-text-medium)' }}>Marketplace products from catalog favorites and new seller listings</p>
            </div>
            <Link to="/products">
              <Button variant="primaryBlack">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: 'var(--kinara-white)' }}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
            {categoryCards.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-lg transition-all flex flex-col items-center justify-center p-3 sm:p-4" style={{ backgroundColor: 'var(--kinara-cream-light)' }}>
                  <span className="text-2xl sm:text-3xl mb-2">{category.icon}</span>
                  <span className="font-semibold text-xs sm:text-sm text-center transition-colors line-clamp-2" style={{ color: 'var(--kinara-text-medium)' }}>
                    {category.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: '#ffffff' }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#000000' }}>
            Are you an artisan or tailor?
          </h2>
          <p className="text-lg mb-8" style={{ color: '#000000', opacity: 0.7 }}>
            Join our platform and showcase your handmade clothing to customers across the country
          </p>
          <Button size="lg" variant="primaryBlack" onClick={() => navigate('/seller/signup')}>
            Become a Seller
          </Button>
        </div>
      </section>
    </div>
  );
}
