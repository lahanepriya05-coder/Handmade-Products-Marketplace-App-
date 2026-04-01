# Testing & Code Reference Guide

## 🧪 How to Test Each Feature

### 1. Testing Category Navigation

**Desktop Testing:**
1. Open homepage: `http://localhost:5173/`
2. Scroll to "Shop by Category" section
3. Click any category card (e.g., "Sarees")
4. ✅ Should navigate to `/products?category=Sarees`
5. ✅ Product list should show only Sarees products
6. ✅ Category button in sidebar should be highlighted

**Mobile Testing:**
1. Open homepage on mobile (use DevTools or actual device)
2. Scroll to "Shop by Category" section
3. Grid should show 2 columns on mobile, 3 on tablet
4. Click any category
5. ✅ Should navigate to products page with filter applied

**URL Verification:**
```
Homepage click "Sarees" 
  → URL changes to: /products?category=Sarees
  → ProductList reads query param
  → Filters to show only "Sarees" products
```

---

### 2. Testing "View All Products" Button

**Steps:**
1. Open homepage: `http://localhost:5173/`
2. Look for "Explore Products" button in Hero section
3. Click the button
4. ✅ Should navigate to `/products`
5. ✅ Should show all products (no filters applied)

**Visual Check:**
- Desktop: Button is visible and clickable
- Mobile: Button remains accessible and responsive

---

### 3. Testing Add to Cart

**Desktop Steps:**
1. Go to Products page or Homepage
2. Find any product card
3. Look for "Add" button at bottom right of card
4. Click "Add" button
5. ✅ Toast notification appears: "Product added to cart!"
6. ✅ Cart icon in header shows number badge
7. ✅ Cart count increments

**Mobile Steps:**
1. Same as desktop but on mobile device
2. Verify toast appears at bottom right (doesn't cover important content)

**Test Multiple Adds:**
1. Add product 1 → Cart shows "1"
2. Add product 2 → Cart shows "2"
3. Add same product 1 again → Cart shows "3"
4. ✅ Badge updates correctly

---

### 4. Testing Mobile Hamburger Menu

**Steps:**
1. Open app on mobile device or use DevTools (toggle device toolbar)
2. Look at top right corner - should see hamburger icon (≡)
3. Click hamburger icon
4. ✅ Icon changes to X
5. ✅ Menu slides in from top with animation
6. ✅ Shows: Home, Products, Artisans, About links
7. Click any menu link
8. ✅ Menu closes automatically
9. ✅ Icon changes back to hamburger (≡)

**Desktop Check:**
- Hamburger menu should NOT be visible (hidden by `md:hidden` class)
- Normal navigation bar should show

---

### 5. Testing Responsive Grids

**Category Cards Grid:**

Use DevTools to test different breakpoints:

```
Width: 320px (Mobile)
├─ Grid: grid-cols-2
└─ Shows: 2 columns

Width: 640px (Tablet)
├─ Grid: sm:grid-cols-3
└─ Shows: 3 columns

Width: 1024px (Desktop)
├─ Grid: lg:grid-cols-4
└─ Shows: 4 columns

Width: 1280px (Large Desktop)
├─ Grid: xl:grid-cols-6
└─ Shows: 6 columns
```

**Product Cards Grid:**

```
Width: 320px (Mobile)
├─ Grid: grid-cols-1
└─ Shows: 1 column (full width)

Width: 640px (Tablet)
├─ Grid: sm:grid-cols-2
└─ Shows: 2 columns

Width: 1024px+ (Desktop)
├─ Grid: lg:grid-cols-3
└─ Shows: 3 columns
```

**Testing Steps:**
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Drag to resize width
4. ✅ Grid columns should change at breakpoints
5. ✅ Text should scale appropriately
6. ✅ Spacing should adjust

---

### 6. Testing Filter Drawer (Mobile)

**Desktop (lg+ screens):**
1. Go to `/products`
2. Left sidebar should show filters
3. Sidebar should be sticky
4. No "Filters" button should be visible

**Mobile (below lg breakpoint):**
1. Go to `/products`
2. Left sidebar should be hidden
3. Click "Filters" button next to product count
4. ✅ Sheet slides in from left
5. ✅ Shows title "Filter Products"
6. ✅ Shows all filter options
7. Click any category
8. ✅ Products update immediately
9. ✅ Sheet closes automatically

---

## 💻 Code Snippets for Reference

### Custom Hook: useSearchParams (if needed)

```typescript
// For more complex filtering, you can extract this into a custom hook
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam.toLowerCase());
    }
  }, [searchParams]);

  const updateCategory = (category: string) => {
    setSelectedCategory(category);
    setSearchParams({ category });
  };

  return { selectedCategory, updateCategory };
}

// Usage in component:
// const { selectedCategory, updateCategory } = useProductFilters();
```

### Enhanced Toast with Different Variants

```typescript
import { toast } from 'sonner';

// Success
toast.success('Product added to cart!', {
  description: 'Continue shopping or proceed to checkout',
});

// Error
toast.error('Failed to add product', {
  description: 'Please try again',
});

// Info
toast.info('New products added', {
  description: 'Check out our latest collection',
});

// Custom with action
toast.message('Item in cart', {
  description: 'View cart',
  action: {
    label: 'View',
    onClick: () => navigate('/cart'),
  },
});
```

### Persisting Cart to localStorage

```typescript
// App.tsx - if you want to persist cart

const [cartItems, setCartItems] = useState<string[]>(() => {
  const saved = localStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
});

const handleAddToCart = (productId: string) => {
  const newCart = [...cartItems, productId];
  setCartItems(newCart);
  localStorage.setItem('cart', JSON.stringify(newCart));
  toast.success('Product added to cart!');
};
```

---

## 🔍 Debugging Tips

### 1. Checking Route Parameters

Open DevTools Console and run:
```javascript
// Get current URL search params
const params = new URLSearchParams(window.location.search);
console.log('Category:', params.get('category'));
```

### 2. Checking Cart State

Add debug log in App.tsx:
```typescript
useEffect(() => {
  console.log('Current cart items:', cartItems);
}, [cartItems]);
```

### 3. Testing Filter Logic

In ProductList.tsx, add console logs:
```typescript
console.log('Selected Category:', selectedCategory);
console.log('Filtered Products:', filteredProducts);
console.log('Sorted Products:', sortedProducts);
```

### 4. Mobile Testing Tips

```bash
# Chrome DevTools shortcuts
- F12: Open DevTools
- Ctrl+Shift+M: Toggle device mode
- Ctrl+Shift+C: Element picker

# Test these viewports:
- 320px (iPhone SE)
- 375px (iPhone 12)
- 768px (iPad)
- 1024px (iPad Pro)
- 1280px (Desktop)
```

---

## ✅ Testing Checklist

### Homepage
- [ ] "Explore Products" button navigates to /products
- [ ] Category cards are clickable
- [ ] Category cards navigate with correct query param
- [ ] Category grid shows correct columns (2/3/4/6)
- [ ] "View All" button in Featured Products works
- [ ] Add to cart shows toast on product cards

### Products Page
- [ ] URL query param filters products correctly
- [ ] Category buttons in sidebar update filter
- [ ] Mobile filter drawer opens/closes
- [ ] Sort dropdown works (price, rating)
- [ ] Grid shows correct columns (1/2/3)
- [ ] Product count updates

### Header
- [ ] Logo links home
- [ ] Desktop nav visible on large screens
- [ ] Mobile menu hidden on desktop
- [ ] Hamburger visible on mobile
- [ ] Menu opens/closes with animation
- [ ] Menu closes when link clicked
- [ ] Cart badge shows correct count

### Responsive Design
- [ ] All layouts work at 320px width
- [ ] All layouts work at 768px width
- [ ] All layouts work at 1024px width
- [ ] All layouts work at 1440px width
- [ ] Text is readable at all sizes
- [ ] No horizontal scroll

---

## 🐛 Common Issues & Solutions

### Issue: "useSearchParams" is not defined
**Solution:** Make sure to import from react-router-dom:
```typescript
import { useSearchParams } from 'react-router-dom';
```

### Issue: Toast notification not showing
**Solution:** Check that `<Toaster />` is in App.tsx:
```typescript
import { Toaster } from 'sonner';

<Toaster position="bottom-right" />
```

### Issue: Mobile menu doesn't close
**Solution:** Make sure `closeMenu()` is called:
```typescript
<Link to="/products" onClick={closeMenu}>
  Products
</Link>
```

### Issue: Categories not filtering
**Solution:** Check that categories in products.ts match the product.category field:
```typescript
// products.ts should have categories like:
export const categories = [
  { id: 'sarees', name: 'Sarees', count: ... },
  // The 'name' should match product.category exactly
];
```

### Issue: Grid not responsive
**Solution:** Make sure Tailwind CSS is properly configured in your build

---

## 📈 Performance Optimization Tips

### 1. Optimize Re-renders
```typescript
// Wrap category cards in React.memo if they're expensive
import { memo } from 'react';

const CategoryCard = memo(({ category, onClick }) => (
  // card content
));
```

### 2. Lazy Load Images
```typescript
// Already implemented in ImageWithFallback component
// Ensure it has loading="lazy" attribute
<img src={src} loading="lazy" alt={alt} />
```

### 3. Debounce Search (if implemented later)
```typescript
import { useMemo } from 'react';
import { debounce } from 'lodash'; // or your own implementation

const handleSearch = useMemo(
  () => debounce((searchTerm) => {
    // search logic
  }, 300),
  []
);
```

---

## 🚀 Deployment Checklist

- [ ] Build succeeds: `npm run build`
- [ ] No console errors in development
- [ ] All features tested in Chrome/Firefox/Safari
- [ ] Mobile testing on actual device
- [ ] Toast notifications working
- [ ] Category filtering working
- [ ] Mobile menu fully functional
- [ ] Images loading correctly
- [ ] No broken links
- [ ] Performance acceptable (<3s load time)

---

## 📚 Useful Resources

- [React Router Documentation](https://reactrouter.com/)
- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [Sonner Toast Docs](https://sonner.emilkowal.ski/)
- [React Hooks API](https://react.dev/reference/react/hooks)

---

Good luck with your implementation! 🎉
