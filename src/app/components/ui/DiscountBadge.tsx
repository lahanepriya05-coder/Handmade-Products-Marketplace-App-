import { Badge } from '@/app/components/ui/badge';

interface DiscountBadgeProps {
  originalPrice: number;
  discountedPrice: number;
  className?: string;
}

export function DiscountBadge({ originalPrice, discountedPrice, className }: DiscountBadgeProps) {
  const discountPercentage = Math.round(
    ((originalPrice - discountedPrice) / originalPrice) * 100
  );

  if (discountPercentage <= 0) return null;

  return (
    <Badge className={`bg-red-600 hover:bg-red-700 ${className}`}>
      {discountPercentage}% OFF
    </Badge>
  );
}
