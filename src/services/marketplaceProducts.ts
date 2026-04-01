import apiClient from '@/services/apiClient';
import { categories as staticCategories, products as staticProducts, Product as CatalogProduct } from '@/data/products';

export type MarketplaceProduct = CatalogProduct & {
  sellerId?: string;
  source?: 'catalog' | 'seller';
};

interface ApiMarketplaceProduct {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  images?: string[];
  price: number;
  stock: number;
  seller?: {
    id: string;
    name: string;
    shopName?: string;
  };
}

const fallbackAvatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop';

const normalizeApiProduct = (product: ApiMarketplaceProduct): MarketplaceProduct => ({
  id: product.id,
  name: product.title,
  description: product.description,
  price: Number(product.price),
  category: product.category,
  artisan: {
    id: product.seller?.id || product.sellerId,
    name: product.seller?.shopName || product.seller?.name || 'Marketplace Seller',
    location: 'India',
    avatar: fallbackAvatar,
  },
  images: product.images?.length ? product.images : [product.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&h=800&fit=crop'],
  inStock: Number(product.stock) > 0,
  rating: 4.8,
  reviews: 0,
  sizes: ['One Size'],
  materials: ['Handmade'],
  sellerId: product.sellerId,
  source: 'seller',
});

const staticMarketplaceProducts: MarketplaceProduct[] = staticProducts.map((product) => ({
  ...product,
  source: 'catalog',
}));

export const fetchMarketplaceProducts = async (): Promise<MarketplaceProduct[]> => {
  try {
    const response = await apiClient.get('/api/products');
    const apiProducts = Array.isArray(response.data?.products) ? response.data.products : [];
    const dynamicProducts = apiProducts.map(normalizeApiProduct);
    const merged = [...dynamicProducts, ...staticMarketplaceProducts];
    return merged.filter((product, index, list) => list.findIndex((item) => item.id === product.id) === index);
  } catch (error) {
    console.error('Failed to fetch marketplace products, falling back to catalog', error);
    return staticMarketplaceProducts;
  }
};

export const fetchMarketplaceProductById = async (productId: string): Promise<MarketplaceProduct | null> => {
  const staticMatch = staticMarketplaceProducts.find((product) => product.id === productId);

  try {
    const response = await apiClient.get(`/api/products/${productId}`);
    if (response.data?.product) {
      return normalizeApiProduct(response.data.product);
    }
  } catch (error) {
    if (!staticMatch) {
      console.error('Failed to fetch product detail from API', error);
    }
  }

  return staticMatch || null;
};

export const buildCategoriesFromProducts = (products: MarketplaceProduct[]) => {
  const counts = new Map<string, number>();

  products.forEach((product) => {
    counts.set(product.category, (counts.get(product.category) || 0) + 1);
  });

  const catalogOrder = staticCategories.map((category) => category.name);
  const dynamicCategories = Array.from(counts.keys()).sort((a, b) => {
    const aIndex = catalogOrder.indexOf(a);
    const bIndex = catalogOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return [
    { id: 'all', name: 'All Products', count: products.length },
    ...dynamicCategories.map((name) => ({
      id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      count: counts.get(name) || 0,
    })),
  ];
};
