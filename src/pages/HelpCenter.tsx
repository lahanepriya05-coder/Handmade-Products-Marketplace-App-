import { Card } from '@/app/components/ui/card';

export function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            Help Center
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Find quick answers about shopping, seller accounts, orders, and account access on Kinara.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Buying on Kinara</h2>
            <p className="text-gray-600 leading-7">
              Buyers can browse products, open product details, add items to cart, and place orders through the checkout flow.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Seller Support</h2>
            <p className="text-gray-600 leading-7">
              Sellers can sign up, log in, access the seller dashboard, add products, and review orders from their account.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Order Questions</h2>
            <p className="text-gray-600 leading-7">
              If you placed an order, you can review it in the orders section after logging in with your buyer account.
            </p>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Account Access</h2>
            <p className="text-gray-600 leading-7">
              Use the login and signup pages for buyers or sellers depending on how you want to use the platform.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
