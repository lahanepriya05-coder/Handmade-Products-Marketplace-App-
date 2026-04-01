import { Link } from 'react-router-dom';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { blogPosts } from '@/data/blogPosts';

export function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>
            Kinara Blog
          </h1>
          <p className="text-gray-600 max-w-3xl">
            Explore stories, ideas, and guidance around handmade products, artisans, and seller growth.
          </p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {blogPosts.map((post) => (
            <Card key={post.slug} className="p-8 hover:shadow-lg transition-shadow">
              <div className="mb-3 flex flex-wrap gap-3 text-sm text-gray-500">
                <span>{post.author}</span>
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="text-2xl font-semibold mb-3">{post.title}</h2>
              <p className="text-gray-700 leading-8 mb-6">{post.description}</p>
              <Link to={`/blog/${post.slug}`}>
                <Button variant="primaryBlack">Read More</Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
