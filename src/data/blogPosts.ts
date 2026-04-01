export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  description: string;
  author: string;
  readTime: string;
  date: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'why-handmade-fashion-matters',
    title: 'Why Handmade Fashion Matters',
    excerpt: 'How handmade products preserve culture, support skilled work, and offer something unique to buyers.',
    description:
      'Handmade fashion carries identity, detail, and tradition. It gives buyers something more personal while supporting creators directly.',
    author: 'Kinara Team',
    readTime: '4 min read',
    date: 'March 31, 2026',
    content: [
      'Handmade fashion is more than clothing. It reflects the time, skill, and care that goes into creating something meaningful by hand rather than by mass production.',
      'When buyers choose handmade products, they often receive better craftsmanship, more thoughtful design, and a direct connection to the story behind the item.',
      'For artisans and small sellers, digital marketplaces like Kinara create visibility. A product that once had only local reach can now be discovered by customers across the country.',
      'That is why handmade fashion matters. It keeps traditional skill alive while opening new opportunities for creators and more authentic choices for buyers.',
    ],
  },
  {
    slug: 'starting-as-a-seller-on-kinara',
    title: 'Starting as a Seller on Kinara',
    excerpt: 'A quick guide for creating better listings, using clear images, and writing product descriptions that convert.',
    description:
      'A strong seller profile starts with clear product photos, honest descriptions, and thoughtful pricing. Small improvements build trust quickly.',
    author: 'Kinara Team',
    readTime: '5 min read',
    date: 'March 31, 2026',
    content: [
      'Starting as a seller is easier when the basics are done well. A strong listing begins with a clear product title, quality image, fair price, and accurate description.',
      'Buyers make decisions quickly. If your product photos are clear and your description explains the material, category, and value of the item, trust builds faster.',
      'Sellers should also think about consistency. A clean dashboard, updated product stock, and complete product details help your shop look more professional.',
      'Kinara is designed to support that journey by giving sellers a single place to register, manage products, and reach interested buyers.',
    ],
  },
  {
    slug: 'supporting-artisans-through-digital-commerce',
    title: 'Supporting Artisans Through Digital Commerce',
    excerpt: 'Online marketplaces can help artisans go beyond local reach and connect their work with a wider audience without losing authenticity.',
    description:
      'Online marketplaces can help artisans go beyond local reach and connect their work with a wider audience without losing authenticity.',
    author: 'Kinara Team',
    readTime: '4 min read',
    date: 'March 31, 2026',
    content: [
      'Digital commerce can be powerful for artisans when it is designed around visibility, trust, and storytelling instead of just transactions.',
      'A marketplace like Kinara gives artisans a digital shelf where buyers can discover their work, understand the product, and place orders with confidence.',
      'The goal is not to replace craftsmanship with technology. The goal is to use technology to make craftsmanship easier to discover and more sustainable as a business.',
      'When digital tools support handmade work properly, everyone benefits: sellers grow, buyers find authentic products, and local creativity gets the spotlight it deserves.',
    ],
  },
];
