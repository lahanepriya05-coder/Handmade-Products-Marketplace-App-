import { Card } from '@/app/components/ui/card';

export function ShippingInfo() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            Shipping Info
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Shipping timelines and availability can vary depending on the seller, product type, and delivery location.
          </p>
        </div>

        <Card className="p-8">
          <p className="text-gray-700 leading-8 mb-4">
            Kinara supports standard order checkout for handmade products listed by marketplace sellers. Estimated delivery time
            depends on order processing, handmade preparation time, and courier availability.
          </p>
          <p className="text-gray-700 leading-8 mb-4">
            Buyers should review product details carefully before ordering, especially for handcrafted items that may have
            limited stock or custom preparation time.
          </p>
          <p className="text-gray-700 leading-8">
            For future versions of the platform, shipping tracking and more detailed delivery updates can be added directly to
            the order flow.
          </p>
        </Card>
      </div>
    </div>
  );
}
