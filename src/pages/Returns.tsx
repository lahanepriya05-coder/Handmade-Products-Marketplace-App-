import { Card } from '@/app/components/ui/card';

export function Returns() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            Returns
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Handmade items may follow seller-specific return conditions depending on the nature of the product.
          </p>
        </div>

        <Card className="p-8">
          <p className="text-gray-700 leading-8 mb-4">
            Because many items on Kinara are handmade, personalized, or prepared in limited quantities, return handling may vary
            from one product to another.
          </p>
          <p className="text-gray-700 leading-8 mb-4">
            Buyers should contact support or the seller if they receive a damaged item, incorrect order, or product issue that
            needs review.
          </p>
          <p className="text-gray-700 leading-8">
            This page can later be expanded with a more detailed return and refund policy as the marketplace grows.
          </p>
        </Card>
      </div>
    </div>
  );
}
