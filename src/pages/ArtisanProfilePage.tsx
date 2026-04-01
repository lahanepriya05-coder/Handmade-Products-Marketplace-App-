import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, MapPin, Star, Store } from 'lucide-react';
import { artisanProfiles } from '@/data/artisanProfiles';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { fetchMarketplaceProducts, MarketplaceProduct } from '@/services/marketplaceProducts';

interface ArtisanDirectoryEntry {
  id: string;
  name: string;
  location: string;
  avatar: string;
  bio: string;
  instagram?: string;
  facebook?: string;
  website?: string;
  products: MarketplaceProduct[];
}

const defaultBio = 'This seller shares handmade products on Kinara and is now part of the public artisan directory.';

const buildArtisanEntries = (products: MarketplaceProduct[]): ArtisanDirectoryEntry[] => {
  const sellerMap = new Map<string, ArtisanDirectoryEntry>();

  products.forEach((product) => {
    const artisan = product.artisan;
    const existingProfile = artisanProfiles.find((profile) => profile.id === artisan.id);
    const current = sellerMap.get(artisan.id);

    if (current) {
      current.products.push(product);
      return;
    }

    sellerMap.set(artisan.id, {
      id: artisan.id,
      name: artisan.name,
      location: artisan.location || 'India',
      avatar: artisan.avatar,
      bio: existingProfile?.bio || product.description || defaultBio,
      instagram: existingProfile?.instagram,
      facebook: existingProfile?.facebook,
      website: existingProfile?.website,
      products: [product],
    });
  });

  return Array.from(sellerMap.values());
};

export function ArtisanProfilePage() {
  const { artisanId } = useParams<{ artisanId: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const marketplaceProducts = await fetchMarketplaceProducts();
      setProducts(marketplaceProducts);
      setIsLoading(false);
    };

    void loadProducts();
  }, []);

  const artisan = useMemo(
    () => buildArtisanEntries(products).find((entry) => entry.id === artisanId) || null,
    [artisanId, products]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="container mx-auto rounded-2xl border border-orange-100 bg-white p-10 text-center text-gray-600">
          Loading seller profile...
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="container mx-auto rounded-2xl border border-orange-100 bg-white p-10 text-center">
          <Store className="mx-auto h-10 w-10 text-orange-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Seller profile not found</h1>
          <p className="mt-2 text-sm text-gray-600">This seller may not have any active products yet.</p>
          <Button variant="primaryBlack" className="mt-6" onClick={() => navigate('/artisans')}>
            Back to Artisans
          </Button>
        </div>
      </div>
    );
  }

  const averageRating = (
    artisan.products.reduce((sum, product) => sum + product.rating, 0) / artisan.products.length
  ).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="container mx-auto max-w-6xl">
        <button onClick={() => navigate(-1)} className="mb-6 inline-flex items-center text-sm text-gray-600 hover:text-orange-600">
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        <Card className="rounded-3xl border-orange-100 p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            <img src={artisan.avatar} alt={artisan.name} className="h-28 w-28 rounded-full object-cover ring-4 ring-orange-100" />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{artisan.name}</h1>
              <p className="mt-3 flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                {artisan.location}
              </p>
              <p className="mt-4 max-w-3xl text-gray-700">{artisan.bio}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                  {artisan.products.length} Product{artisan.products.length === 1 ? '' : 's'}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  <Star className="h-4 w-4 fill-current" />
                  {averageRating} rating
                </span>
              </div>
              {(artisan.instagram || artisan.facebook || artisan.website) && (
                <div className="mt-5 flex flex-wrap gap-4 text-sm">
                  {artisan.instagram && <a href={artisan.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>}
                  {artisan.facebook && <a href={artisan.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">Facebook</a>}
                  {artisan.website && <a href={artisan.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">Website</a>}
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-10">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Products by {artisan.name}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artisan.products.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block">
                <Card className="overflow-hidden rounded-2xl border-orange-100 transition hover:shadow-lg">
                  <img src={product.images[0]} alt={product.name} className="aspect-square w-full object-cover" />
                  <div className="p-4">
                    <p className="text-sm text-orange-700">{product.category}</p>
                    <h3 className="mt-2 text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{product.description}</p>
                    <p className="mt-4 font-semibold text-orange-700">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
