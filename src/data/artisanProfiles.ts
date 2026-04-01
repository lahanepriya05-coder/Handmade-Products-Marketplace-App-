export interface ArtisanProfile {
  id: string;
  name: string;
  location: string;
  avatar: string;
  bio: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

export const artisanProfiles: ArtisanProfile[] = [
  {
    id: 'a1',
    name: 'Lakshmi Devi',
    location: 'Kanchipuram, Tamil Nadu',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    bio: 'Lakshmi Devi is a master weaver specializing in traditional Kanchipuram silk sarees. Her work preserves centuries-old techniques and brings vibrant designs to life.',
    instagram: 'https://instagram.com/lakshmiweaves',
    website: 'https://kanchipuramsilks.com/lakshmi',
  },
  {
    id: 'a2',
    name: 'Priya Sharma',
    location: 'Jaipur, Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    bio: 'Priya Sharma is renowned for her hand block printing skills, creating beautiful kurtis and textiles using eco-friendly dyes and sustainable methods.',
    instagram: 'https://instagram.com/priyablockprints',
  },
  {
    id: 'a3',
    name: 'Meera Verma',
    location: 'Lucknow, Uttar Pradesh',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop',
    bio: 'Meera Verma crafts exquisite bridal lehengas with intricate embroidery, blending tradition and modern elegance for special occasions.',
    facebook: 'https://facebook.com/meeralehengas',
  },
  {
    id: 'a4',
    name: 'Anita Patel',
    location: 'Sanganer, Rajasthan',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop',
    bio: 'Anita Patel is a specialist in block print silk dupattas, known for her vibrant colors and intricate border work.',
    instagram: 'https://instagram.com/anitasilkprints',
  },
  {
    id: 'a5',
    name: 'Sunita Reddy',
    location: 'Pochampally, Telangana',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
    bio: 'Sunita Reddy weaves handloom cotton dresses, focusing on eco-friendly materials and traditional weaving techniques.',
    website: 'https://pochampallyhandlooms.com/sunita',
  },
];
