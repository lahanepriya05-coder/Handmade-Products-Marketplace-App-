import { Link } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';

const supportLinks = [
  {
    title: 'Help Center',
    path: '/help-center',
    description: 'Quick answers about orders, accounts, sellers, and shopping on Kinara.',
  },
  {
    title: 'Shipping Info',
    path: '/shipping-info',
    description: 'Learn about delivery expectations, order timelines, and shipping details.',
  },
  {
    title: 'Returns',
    path: '/returns',
    description: 'Read the current returns guidance for handmade and marketplace products.',
  },
  {
    title: 'Contact Us',
    path: '/contact-us',
    description: 'Reach Kinara for buyer support, seller assistance, and general inquiries.',
  },
];

export function Support() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            Support
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Get help with shopping, seller tools, shipping, returns, and contacting the Kinara team.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {supportLinks.map((item) => (
            <Link key={item.path} to={item.path} className="block">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-3">{item.title}</h2>
                <p className="text-gray-600 leading-7">{item.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
