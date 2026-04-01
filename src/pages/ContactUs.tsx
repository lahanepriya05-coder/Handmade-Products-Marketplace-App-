import { Card } from '@/app/components/ui/card';

export function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            Contact Us
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Reach out for buyer help, seller support, or general questions about the Kinara marketplace.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Email Support</h2>
            <p className="text-gray-600 leading-7">support@kinara.com</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Seller Assistance</h2>
            <p className="text-gray-600 leading-7">sellers@kinara.com</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Phone</h2>
            <p className="text-gray-600 leading-7">+91 98765 43210</p>
          </Card>
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-3">Working Hours</h2>
            <p className="text-gray-600 leading-7">Monday to Saturday, 10:00 AM to 6:00 PM</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
