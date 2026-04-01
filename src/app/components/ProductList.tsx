import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/app/components/ProductCard';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Filter, Search } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/app/components/ui/sheet';
import { buildCategoriesFromProducts, fetchMarketplaceProducts, MarketplaceProduct } from '@/services/marketplaceProducts';

export function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await fetchMarketplaceProducts();
      setProducts(result);
      setIsLoading(false);
    };

    void loadProducts();
  }, []);

  const categories = buildCategoriesFromProducts(products);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const searchParam = searchParams.get('search');

    if (categoryParam) {
      const categoryId = categories.find(
        (cat) => cat.name.toLowerCase() === categoryParam.toLowerCase()
      )?.id || 'all';
      setSelectedCategory(categoryId);
    } else {
      setSelectedCategory('all');
    }

    setSearchTerm(searchParam || '');
  }, [searchParams, products.length]);

  const updateParams = (nextCategoryId: string, nextSearch: string) => {
    const nextParams: Record<string, string> = {};
    const category = categories.find((cat) => cat.id === nextCategoryId);

    if (category && nextCategoryId !== 'all') {
      nextParams.category = category.name;
    }

    if (nextSearch.trim()) {
      nextParams.search = nextSearch.trim();
    }

    setSearchParams(nextParams);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    updateParams(categoryId, searchTerm);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    updateParams(selectedCategory, value);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all'
        ? true
        : product.category.toLowerCase() === categories.find((cat) => cat.id === selectedCategory)?.name.toLowerCase();

    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      product.artisan.name.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const FilterContent = () => (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5" />
        <h2 className="font-semibold text-lg">Filters</h2>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Search</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search products"
            className="pl-9"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-3">Category</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => handleCategoryChange(category.id)}
            >
              <span>{category.name}</span>
              <span className="ml-auto text-xs">({category.count})</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: 'var(--kinara-cream)' }}>
        <div className="container mx-auto px-4 py-8">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--kinara-cream)' }}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--kinara-brown-primary)' }}>All Products</h1>
          <p style={{ color: 'var(--kinara-text-medium)' }}>Discover unique handmade products from talented artisans and sellers</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <div className="card p-6 sticky top-20" style={{ backgroundColor: 'var(--kinara-white)' }}>
              <FilterContent />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <p style={{ color: 'var(--kinara-text-medium)' }}>
                  {sortedProducts.length} products found
                </p>
                <div className="relative hidden sm:block min-w-[260px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search by product, category, seller"
                    className="pl-9"
                  />
                </div>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Filter Products</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found for the selected filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
