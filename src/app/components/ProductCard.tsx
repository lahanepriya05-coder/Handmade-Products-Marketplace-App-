import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { MarketplaceProduct } from '@/services/marketplaceProducts';
import { Link } from 'react-router-dom';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';

interface ProductCardProps {
  product: MarketplaceProduct;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg card card-product">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden" style={{ backgroundColor: 'var(--kinara-cream-light)' }}>
          <ImageWithFallback
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </Link>

      <div className="p-4">
        <div className="mb-2">
          <Badge className="text-xs badge-peach">
            {product.category}
          </Badge>
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-base mb-1 line-clamp-1" style={{ color: 'var(--kinara-brown-primary)' }}>
            {product.name}
          </h3>
        </Link>

        <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--kinara-text-medium)' }}>
          {product.description}
        </p>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4" style={{ color: 'var(--kinara-gold)' }} />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm" style={{ color: 'var(--kinara-gray-dark)' }}>({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ImageWithFallback
              src={product.artisan.avatar}
              alt={product.artisan.name}
              className="h-6 w-6 rounded-full object-cover"
            />
            <span className="text-xs" style={{ color: 'var(--kinara-text-medium)' }}>{product.artisan.name}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold" style={{ color: 'var(--kinara-brown-primary)' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <Button
            size="sm"
            variant="primaryBlack"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart?.(product.id);
            }}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>
    </Card>
  );
}
