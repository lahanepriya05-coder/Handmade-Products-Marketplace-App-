import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function RatingStars({
  rating,
  reviews,
  size = 'md',
  interactive = false,
  onRate,
}: RatingStarsProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {stars.map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate?.(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-colors`}
          >
            <Star
              className={`${sizeClasses[size]} ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {reviews !== undefined && <span className="text-sm text-gray-600">({reviews})</span>}
    </div>
  );
}
