# ArtisanConnect - Handmade Products Marketplace

A fully responsive React web application connecting artisans with customers across India. Built with React, React Router, and Tailwind CSS for a seamless experience across all devices.

## Features

### 🎨 **Responsive Design**
- **Mobile-First Approach**: Optimized for mobile devices with touch-friendly buttons and gestures
- **Adaptive Layouts**: Seamlessly adjusts from mobile (320px+) to tablet (768px+) to desktop (1024px+)
- **Responsive Typography**: Text scales appropriately across different screen sizes
- **Flexible Grids**: Product grids adapt from 1 column on mobile to 3 columns on desktop

### 🛍️ **Core Functionality**
- **Homepage**: Hero section, featured products, and category browsing
- **Product Listing**: Advanced filtering with mobile drawer, sorting, and responsive grid
- **Product Details**: Full product information with artisan profiles
- **Shopping Cart**: Real-time cart updates with toast notifications
- **Navigation**: Sticky header with hamburger menu on mobile

### 📱 **Mobile-Optimized Features**
- **Mobile Filter Drawer**: Slide-out filter panel using Sheet component on mobile devices
- **Collapsible Header**: Compact logo and search on smaller screens
- **Touch-Friendly Buttons**: Larger touch targets (min 44x44px) for mobile users
- **Responsive Images**: Optimized image loading with fallbacks
- **Mobile Navigation Menu**: Full-screen menu with easy navigation links

### 🎯 **Product Categories**
- Silk Sarees
- Handcrafted Jewelry
- Home Decor
- Traditional Handicrafts
- Hand-Woven Textiles
- Pottery & Ceramics

### 👥 **Artisan Support**
- Direct connection to artisans
- Artisan profiles with location information
- Support for small entrepreneurs
- Preservation of traditional craftsmanship

## Tech Stack

- **React 18.3.1** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS v4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Sonner** - Toast notifications
- **Vite** - Fast build tool and dev server

## Responsive Breakpoints

```css
Mobile: 0-639px (sm)
Tablet: 640-1023px (md)
Desktop: 1024px+ (lg, xl)
```

## Key Components

### Header
- Responsive logo (abbreviated on mobile)
- Sticky navigation
- Mobile menu with hamburger icon
- Cart badge indicator

### ProductList
- Desktop: Sidebar filters + 3-column grid
- Mobile: Filter drawer + 1-column grid
- Responsive sort dropdown

### ProductCard
- Responsive padding and spacing
- Touch-friendly add-to-cart buttons
- Hover effects on desktop
- Optimized images with lazy loading

### ProductDetail
- 2-column layout on desktop
- Single column on mobile
- Responsive artisan info card
- Mobile-optimized action buttons

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Getting Started

The application is pre-configured and ready to run. All dependencies are installed and the development server can be started through the Figma Make interface.

## Future Enhancements

- Progressive Web App (PWA) capabilities
- Offline support with service workers
- Push notifications
- Image optimization with WebP
- Advanced search functionality
- User authentication
- Wishlist functionality
- Order tracking

## Accessibility

- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Touch-friendly targets (minimum 44x44px)

## Performance

- Optimized bundle size
- Lazy loading of images
- Code splitting with React Router
- Fast initial load time
- Smooth animations and transitions

---

Made with ❤️ for artisans and their craft
