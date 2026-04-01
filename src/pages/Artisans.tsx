import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Store } from 'lucide-react';
import { artisanProfiles } from '@/data/artisanProfiles';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
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

  return Array.from(sellerMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const Artisans: React.FC = () => {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [selectedArtisan, setSelectedArtisan] = useState<ArtisanDirectoryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadArtisans = async () => {
      setIsLoading(true);
      const marketplaceProducts = await fetchMarketplaceProducts();
      setProducts(marketplaceProducts);
      setIsLoading(false);
    };

    void loadArtisans();
  }, []);

  const artisans = useMemo(() => buildArtisanEntries(products), [products]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">Artisans</h1>
          <p className="max-w-2xl text-gray-600">
            Discover talented artisans and sellers across Kinara. When a seller adds a new product, their shop now appears here too.
          </p>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-orange-100 bg-white p-10 text-center text-gray-600">
            Loading artisans...
          </div>
        ) : artisans.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {artisans.map((artisan) => (
              <Card key={artisan.id} className="rounded-2xl border-orange-100 p-6">
                <div className="flex flex-col items-center text-center">
                  <img src={artisan.avatar} alt={artisan.name} className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-orange-100" />
                  <h2 className="text-xl font-semibold text-gray-900">{artisan.name}</h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    {artisan.location}
                  </p>
                  <p className="mt-4 line-clamp-3 text-sm text-gray-600">{artisan.bio}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-700">
                      {artisan.products.length} Product{artisan.products.length === 1 ? '' : 's'}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      <Star className="h-3 w-3 fill-current" />
                      {(
                        artisan.products.reduce((sum, product) => sum + product.rating, 0) / artisan.products.length
                      ).toFixed(1)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="primaryBlack"
                    className="mt-5"
                    onClick={() => setSelectedArtisan(artisan)}
                  >
                    View Profile & Products
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200 bg-white p-10 text-center">
            <Store className="mx-auto h-10 w-10 text-orange-600" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">No artisans available yet</h2>
            <p className="mt-2 text-sm text-gray-600">Once products are added to the marketplace, artisan profiles will appear here automatically.</p>
          </div>
        )}
      </div>

      {selectedArtisan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <button
              className="absolute right-4 top-4 text-2xl text-gray-500 hover:text-gray-700"
              onClick={() => setSelectedArtisan(null)}
              aria-label="Close artisan profile"
            >
              ×
            </button>

            <div className="flex flex-col items-center text-center">
              <img src={selectedArtisan.avatar} alt={selectedArtisan.name} className="mb-4 h-24 w-24 rounded-full object-cover ring-4 ring-orange-100" />
              <h2 className="text-2xl font-bold text-gray-900">{selectedArtisan.name}</h2>
              <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {selectedArtisan.location}
              </p>
              <p className="mt-4 max-w-xl text-gray-700">{selectedArtisan.bio}</p>

              {(selectedArtisan.instagram || selectedArtisan.facebook || selectedArtisan.website) && (
                <div className="mt-5 flex flex-wrap justify-center gap-4 text-sm">
                  {selectedArtisan.instagram && (
                    <a href={selectedArtisan.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">
                      Instagram
                    </a>
                  )}
                  {selectedArtisan.facebook && (
                    <a href={selectedArtisan.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                      Facebook
                    </a>
                  )}
                  {selectedArtisan.website && (
                    <a href={selectedArtisan.website} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">
                      Website
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">Products by {selectedArtisan.name}</h3>
              <div className="space-y-3">
                {selectedArtisan.products.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center gap-4 rounded-2xl border border-orange-100 p-3 transition hover:border-orange-300 hover:bg-orange-50"
                    onClick={() => setSelectedArtisan(null)}
                  >
                    <img src={product.images[0]} alt={product.name} className="h-16 w-16 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                    <p className="font-semibold text-orange-700">₹{product.price.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artisans;
