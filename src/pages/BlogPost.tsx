import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { blogPosts } from '@/data/blogPosts';

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => blogPosts.find((item) => item.slug === slug), [slug]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <Link to="/blog" className="inline-flex items-center text-sm font-medium text-orange-700 hover:text-orange-800 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>

          <Card className="rounded-3xl p-8 md:p-10 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-3 text-sm text-gray-500">
              <span>{post.author}</span>
              <span>{post.date}</span>
              <span>{post.readTime}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--kinara-brown-primary)' }}>
              {post.title}
            </h1>
            <p className="text-lg text-gray-700 leading-8 mb-8">{post.excerpt}</p>

            <div className="space-y-6">
              {post.content.map((paragraph, index) => (
                <p key={index} className="text-gray-700 leading-8">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/blog">
                <Button variant="primaryBlack">More Blog Posts</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
