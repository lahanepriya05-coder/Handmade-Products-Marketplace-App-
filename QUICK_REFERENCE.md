# 🚀 Quick Start Reference Card

## Files to Know

```
src/
├── app/
│   ├── App.tsx (Cart state, routing)
│   ├── components/
│   │   ├── Header.tsx (Mobile menu ☰)
│   │   ├── Homepage.tsx (Category cards, "View All" button)
│   │   ├── ProductList.tsx (Query params, filter drawer)
│   │   └── ProductCard.tsx (Add to cart button)
│   └── main.tsx
├── data/
│   └── products.ts (Products & categories)
└── styles/
    └── index.css
```

---

## ⚡ Key Commands

```bash
# Start development
npm run dev
# Opens: http://localhost:5173/

# Build for production
npm run build
# Creates: dist/ folder

# Install dependencies (if needed)
npm install
```

---

## 🎯 Feature Locations

| Feature | File | Component | Method |
|---------|------|-----------|--------|
| Category Navigation | Homepage.tsx | handleCategoryClick | useNavigate |
| Query Parameter Reading | ProductList.tsx | useEffect | useSearchParams |
| Add to Cart | App.tsx | handleAddToCart | useState + toast |
| Mobile Menu | Header.tsx | mobileMenuOpen | useState |
| Responsive Grid | Homepage.tsx | className | Tailwind |
| Filter Drawer | ProductList.tsx | FilterContent | Sheet component |

---

## 🎨 CSS Grid Reference

### Homepage Categories
```
Mobile:  grid-cols-2
Tablet:  sm:grid-cols-3
Desktop: lg:grid-cols-4
Large:   xl:grid-cols-6
```

### Product Cards
```
Mobile:  grid-cols-1
Tablet:  sm:grid-cols-2
Desktop: lg:grid-cols-3
```

---

## 📱 Responsive Breakpoints

| Device | Width | CSS | Grid |
|--------|-------|-----|------|
| Mobile | 320px | Default | 1-2 cols |
| Tablet | 640px | `sm:` | 2-3 cols |
| Desktop | 1024px | `lg:` | 3-4 cols |
| Large | 1280px | `xl:` | 6 cols |

---

## 🔗 URL Patterns

```
Homepage:           /
Products All:       /products
Filter by Category: /products?category=Sarees
Product Detail:     /product/{id}
```

---

## 🎬 User Flows

### Add to Cart
```
ProductCard → Click "Add" button 
→ handleAddToCart(productId)
→ setCartItems([...cartItems, id])
→ Toast notification
→ Badge updates
```

### Category Navigation
```
Homepage → Click category card
→ handleCategoryClick(name)
→ navigate(/products?category=...)
→ ProductList reads searchParams
→ Filters products
```

### Mobile Menu
```
Click ☰ → setMobileMenuOpen(true)
→ Menu appears with animation
→ Click link → closeMenu()
→ Icon changes back to ☰
```

---

## 🛠️ Component Props

### Header
```typescript
interface HeaderProps {
  cartItemsCount?: number; // Shows in cart badge
}
```

### Homepage
```typescript
interface HomepageProps {
  onAddToCart: (productId: string) => void;
}
```

### ProductList & ProductCard
```typescript
interface ProductListProps {
  onAddToCart: (productId: string) => void;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}
```

---

## 🎨 Styling Quick Tips

```typescript
// Mobile only
className="md:hidden"

// Desktop only
className="hidden md:flex"

// Responsive text
className="text-xs sm:text-sm md:text-base"

// Responsive padding
className="p-3 sm:p-4 md:p-6"

// Responsive gap
className="gap-2 sm:gap-3 md:gap-4"

// Hover effects
className="hover:text-orange-600 transition-colors"

// Grid columns
className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
```

---

## 📦 Key Libraries

```typescript
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/app/components/ui/button';
import { Sheet, SheetContent } from '@/app/components/ui/sheet';
```

---

## 🧪 Quick Test Checklist

- [ ] Homepage category cards clickable
- [ ] URL changes to `/products?category=...`
- [ ] Products filter correctly
- [ ] "Explore Products" button works
- [ ] "Add" button shows toast
- [ ] Cart badge updates
- [ ] Mobile menu opens (☰ → ✕)
- [ ] Mobile menu closes on link click
- [ ] Grid responsive at breakpoints
- [ ] No console errors

---

## 🐛 Common Tweaks

**Change toast message:**
```typescript
toast.success('Your message here');
```

**Change category icons:**
```typescript
{ name: 'Sarees', icon: '👗' } // Change emoji
```

**Add new category:**
```typescript
{ name: 'New Category', icon: '🎨' }
```

**Change colors:**
```typescript
className="text-orange-600" // Change color
className="bg-pink-500 hover:bg-pink-600"
```

**Adjust spacing:**
```typescript
className="gap-3 sm:gap-4" // Change gap values
className="p-4 sm:p-6" // Change padding
```

---

## 🔧 Debug Commands (Browser Console)

```javascript
// Check current URL params
new URLSearchParams(window.location.search).get('category')

// Check cart count (if logged)
console.log('Cart:', cartItems)

// Test navigation
window.location.href = '/products?category=Sarees'
```

---

## 📚 Documentation Files

- **IMPLEMENTATION_GUIDE.md** - Full technical docs with code
- **TESTING_GUIDE.md** - Testing steps and debugging tips
- **CHANGELOG.md** - Summary of all changes
- **README.md** - Original project README

---

## ✨ Best Practices

✅ **Do:**
- Use TypeScript for type safety
- Handle loading states
- Show user feedback (toast, loader)
- Test responsive at all breakpoints
- Keep components small & focused

❌ **Don't:**
- Hardcode values (use constants)
- Skip error handling
- Forget alt text on images
- Skip mobile testing
- Ignore accessibility

---

## 🚀 Ready to Deploy?

1. ✅ Run `npm run build`
2. ✅ Check no errors in output
3. ✅ Test all features
4. ✅ Deploy `dist/` folder
5. ✅ Verify on production

---

**Last Updated:** February 10, 2026  
**Status:** ✅ Production Ready  
**Version:** 1.0.0
