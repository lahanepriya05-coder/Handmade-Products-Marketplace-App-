import { Globe, HeartHandshake, ShoppingBag, Store } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';

const highlights = [
  {
    icon: <Globe className="h-6 w-6 text-orange-600" />,
    title: 'Marketplace for Handmade Fashion',
    description:
      'Kinara is a handmade products marketplace focused on clothing, textiles, and artisan-made fashion from across India.',
  },
  {
    icon: <Store className="h-6 w-6 text-orange-600" />,
    title: 'Built for Sellers',
    description:
      'Sellers can create accounts, manage their dashboard, add products, and reach buyers through a single shared marketplace.',
  },
  {
    icon: <ShoppingBag className="h-6 w-6 text-orange-600" />,
    title: 'Simple for Buyers',
    description:
      'Buyers can browse all products, search by category, open product details, add items to cart, and place orders with ease.',
  },
  {
    icon: <HeartHandshake className="h-6 w-6 text-orange-600" />,
    title: 'Supports Artisan Growth',
    description:
      'The website is designed to help artisans and small sellers showcase their work online and connect directly with customers.',
  },
];

export function About() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            About Kinara
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Kinara is a website created to connect buyers with artisans and handmade-product sellers. It brings traditional
            craftsmanship into a modern online marketplace where unique products can be discovered, listed, and purchased
            easily.
          </p>
        </div>

        <section className="grid gap-6 md:grid-cols-2 mb-10">
          {highlights.map((item) => (
            <Card key={item.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex rounded-full bg-orange-50 p-3">
                {item.icon}
              </div>
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 leading-7">{item.description}</p>
            </Card>
          ))}
        </section>

        <section id="story" className="mb-10">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-8 mb-4">
              Kinara began with a simple idea: handmade work deserves a better digital stage. Many artisans and small sellers
              create beautiful products, but their work often remains limited to local reach. This website was created to help
              those makers present their products online in a clean, trustworthy, and easy-to-use marketplace.
            </p>
            <p className="text-gray-700 leading-8">
              We want buyers to discover authentic handmade fashion in one place, while sellers get tools to grow their
              business through product listings, dashboards, and direct visibility. Kinara is our way of bringing craftsmanship,
              culture, and commerce together.
            </p>
          </Card>
        </section>

        <section className="mb-10">
          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-4">What This Website Offers</h2>
            <p className="text-gray-700 leading-8 mb-4">
              The platform includes public product browsing, seller registration and login, seller dashboards for adding
              products, category-based product discovery, and buyer ordering flows. The goal is to make handmade fashion more
              visible while giving sellers a professional space to present their work.
            </p>
            <p className="text-gray-700 leading-8">
              In short, Kinara is a digital bridge between craftsmanship and commerce, helping handmade businesses grow while
              giving buyers access to authentic products in one place.
            </p>
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold">Blog</h2>
              <p className="text-gray-600 mt-1">Stories, ideas, and insights from the handmade marketplace.</p>
            </div>
            <Link to="/blog">
              <Button variant="primaryBlack">View Blog</Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} to={`/blog/${post.slug}`} className="block">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold mb-3">{post.title}</h3>
                  <p className="text-gray-600 leading-7 mb-4">{post.excerpt}</p>
                  <span className="text-sm font-semibold text-orange-700">Read article</span>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
