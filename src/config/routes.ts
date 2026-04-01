export const ROUTES = {
  // Public routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/product/:id',
  ARTISANS: '/artisans',
  ARTISAN_DETAIL: '/artisans/:id',
  ABOUT: '/about',
  HELP: '/help',

  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',

  // Customer protected routes
  PROFILE: '/profile',
  CART: '/cart',
  WISHLIST: '/wishlist',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  ACCOUNT: '/account',

  // Seller routes
  BECOME_SELLER: '/become-seller',
  SELLER_DASHBOARD: '/seller/dashboard',
  SELLER_PRODUCTS: '/seller/products',
  SELLER_ORDERS: '/seller/orders',
  SELLER_ANALYTICS: '/seller/analytics',

  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS: '/admin/users',
  ADMIN_PRODUCTS: '/admin/products',

  // Not found
  NOT_FOUND: '*',
} as const;

// Route groups for better organization
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.PRODUCTS,
  ROUTES.PRODUCT_DETAIL,
  ROUTES.ARTISANS,
  ROUTES.ARTISAN_DETAIL,
  ROUTES.ABOUT,
  ROUTES.HELP,
] as const;

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.SIGNUP,
  ROUTES.FORGOT_PASSWORD,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.CART,
  ROUTES.WISHLIST,
  ROUTES.CHECKOUT,
  ROUTES.ORDERS,
  ROUTES.ACCOUNT,
] as const;

export const SELLER_ROUTES = [
  ROUTES.SELLER_DASHBOARD,
  ROUTES.SELLER_PRODUCTS,
  ROUTES.SELLER_ORDERS,
  ROUTES.SELLER_ANALYTICS,
  ROUTES.BECOME_SELLER,
] as const;

export const ADMIN_ROUTES = [
  ROUTES.ADMIN_DASHBOARD,
  ROUTES.ADMIN_USERS,
  ROUTES.ADMIN_PRODUCTS,
] as const;

// Helper functions for route management
export const getRouteParams = (route: string, params: Record<string, string>): string => {
  let path = route;
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  return path;
};

export const isPublicRoute = (route: string): boolean => {
  return PUBLIC_ROUTES.some((publicRoute) => {
    if (publicRoute.includes(':')) {
      const pattern = publicRoute.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(route);
    }
    return publicRoute === route;
  });
};

export const isProtectedRoute = (route: string): boolean => {
  return PROTECTED_ROUTES.some((protectedRoute) => {
    if (protectedRoute.includes(':')) {
      const pattern = protectedRoute.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(route);
    }
    return protectedRoute === route;
  });
};

export const isSellerRoute = (route: string): boolean => {
  return SELLER_ROUTES.some((sellerRoute) => {
    if (sellerRoute.includes(':')) {
      const pattern = sellerRoute.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(route);
    }
    return sellerRoute === route;
  });
};

export const isAdminRoute = (route: string): boolean => {
  return ADMIN_ROUTES.some((adminRoute) => {
    if (adminRoute.includes(':')) {
      const pattern = adminRoute.replace(/:\w+/g, '[^/]+');
      return new RegExp(`^${pattern}$`).test(route);
    }
    return adminRoute === route;
  });
};
