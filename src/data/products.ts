export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  artisan: {
    id: string;
    name: string;
    location: string;
    avatar: string;
  };
  images: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
  sizes?: string[];
  materials?: string[];
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Royal Kanchipuram Silk Saree',
    description: 'Handwoven silk saree with intricate gold zari work. Made using traditional techniques passed down through generations. Features classic temple border and rich pallu design.',
    price: 15000,
    category: 'Sarees',
    artisan: {
      id: 'a1',
      name: 'Lakshmi Devi',
      location: 'Kanchipuram, Tamil Nadu',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1742287721821-ddf522b3f37b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWxrJTIwc2FyZWUlMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NzAxMjgzOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.8,
    reviews: 24,
    sizes: ['One Size'],
    materials: ['Pure Silk', 'Gold Zari'],
  },
  {
    id: '2',
    name: 'Hand Block Print Cotton Kurti',
    description: 'Elegant handwoven kurti with traditional block print patterns. Made from breathable cotton fabric with natural dyes. Perfect for everyday wear.',
    price: 2800,
    category: 'Kurtas & Kurtis',
    artisan: {
      id: 'a2',
      name: 'Priya Sharma',
      location: 'Jaipur, Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1716823141581-12b24feb01ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kd292ZW4lMjBrdXJ0aSUyMGV0aG5pY3xlbnwxfHx8fDE3NzAxMjgzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.6,
    reviews: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['Cotton', 'Natural Dyes'],
  },
  {
    id: '3',
    name: 'Embroidered Bridal Lehenga',
    description: 'Exquisite handcrafted lehenga with intricate zardozi and sequin work. Features detailed embroidery on premium fabric. Perfect for weddings and special occasions.',
    price: 32000,
    category: 'Lehengas',
    artisan: {
      id: 'a3',
      name: 'Meera Verma',
      location: 'Lucknow, Uttar Pradesh',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1767955694884-d4bf352c23c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGxlaGVuZ2ElMjBlbWJyb2lkZXJlZHxlbnwxfHx8fDE3NzAxMjgzOTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.9,
    reviews: 32,
    sizes: ['Custom'],
    materials: ['Silk', 'Zardozi', 'Sequins'],
  },
  {
    id: '4',
    name: 'Block Print Silk Dupatta',
    description: 'Hand block printed silk dupatta with natural dyes. Lightweight and comfortable. Features traditional Rajasthani motifs and intricate border work.',
    price: 1800,
    category: 'Dupattas & Stoles',
    artisan: {
      id: 'a4',
      name: 'Anita Patel',
      location: 'Sanganer, Rajasthan',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1632754723707-15aaa034f4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9jayUyMHByaW50JTIwZHVwYXR0YSUyMHNjYXJmfGVufDF8fHx8MTc3MDEyODM5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.4,
    reviews: 12,
    sizes: ['One Size'],
    materials: ['Silk', 'Natural Dyes'],
  },
  {
    id: '5',
    name: 'Handloom Cotton Summer Dress',
    description: 'Comfortable handloom cotton dress perfect for summer. Features breathable fabric and elegant design. Made with eco-friendly materials and traditional weaving techniques.',
    price: 3200,
    category: 'Dresses',
    artisan: {
      id: 'a5',
      name: 'Sunita Reddy',
      location: 'Pochampally, Telangana',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1718435112323-c826511d5252?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbG9vbSUyMGNvdHRvbiUyMGRyZXNzfGVufDF8fHx8MTc3MDEyODM5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.5,
    reviews: 21,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    materials: ['Handloom Cotton'],
  },
  {
    id: '6',
    name: 'Traditional Embroidered Jacket',
    description: 'Beautifully embroidered ethnic jacket with mirror work. Features intricate handwork and vibrant colors. Perfect as a statement piece for any outfit.',
    price: 4500,
    category: 'Jackets & Outerwear',
    artisan: {
      id: 'a6',
      name: 'Fatima Begum',
      location: 'Kutch, Gujarat',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1756483510798-c1fe4e476ecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGhuaWMlMjBqYWNrZXQlMjBlbWJyb2lkZXJlZHxlbnwxfHx8fDE3NzAxMjgzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.7,
    reviews: 15,
    sizes: ['S', 'M', 'L', 'XL'],
    materials: ['Cotton', 'Mirror Work', 'Embroidery Thread'],
  },
  {
    id: '7',
    name: 'Kashmiri Pashmina Shawl',
    description: 'Luxurious handwoven Pashmina shawl with intricate embroidery. Made from the finest Pashmina wool. Soft, warm, and elegant for all occasions.',
    price: 8500,
    category: 'Dupattas & Stoles',
    artisan: {
      id: 'a7',
      name: 'Aisha Khan',
      location: 'Srinagar, Kashmir',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1627726997943-6e397135f78a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMHNoYXdsJTIwcGFzaG1pbmF8ZW58MXx8fHwxNzcwMTI4Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.9,
    reviews: 28,
    sizes: ['One Size'],
    materials: ['Pashmina Wool'],
  },
  {
    id: '8',
    name: 'Designer Salwar Kameez Set',
    description: 'Traditional salwar kameez set with modern design. Hand-stitched with attention to detail. Comfortable and stylish for daily wear or special occasions.',
    price: 5200,
    category: 'Salwar Suits',
    artisan: {
      id: 'a8',
      name: 'Rajesh Kumar',
      location: 'Amritsar, Punjab',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    },
    images: ['https://images.unsplash.com/photo-1759851684030-818f50799ce5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHNhbHdhciUyMGthbWVlenxlbnwxfHx8fDE3NzAxMjgzOTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'],
    inStock: true,
    rating: 4.6,
    reviews: 19,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    materials: ['Cotton', 'Silk Blend'],
  },
];

export const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'sarees', name: 'Sarees', count: products.filter(p => p.category === 'Sarees').length },
  { id: 'kurtas-kurtis', name: 'Kurtas & Kurtis', count: products.filter(p => p.category === 'Kurtas & Kurtis').length },
  { id: 'lehengas', name: 'Lehengas', count: products.filter(p => p.category === 'Lehengas').length },
  { id: 'salwar-suits', name: 'Salwar Suits', count: products.filter(p => p.category === 'Salwar Suits').length },
  { id: 'dupattas-stoles', name: 'Dupattas & Stoles', count: products.filter(p => p.category === 'Dupattas & Stoles').length },
  { id: 'dresses', name: 'Dresses', count: products.filter(p => p.category === 'Dresses').length },
  { id: 'jackets-outerwear', name: 'Jackets & Outerwear', count: products.filter(p => p.category === 'Jackets & Outerwear').length },
];
