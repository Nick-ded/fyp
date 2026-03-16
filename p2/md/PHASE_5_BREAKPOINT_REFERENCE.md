# Phase 5: Breakpoint Reference & Visual Guide

## Tailwind Breakpoints Used

```
Mobile:   < 640px  (default)
sm:       640px    (small)
md:       768px    (medium/tablet)
lg:       1024px   (large/desktop)
xl:       1280px   (extra large)
2xl:      1536px   (2x large)
```

## Audit Breakpoints

```
375px   → Mobile (iPhone SE)
768px   → Tablet (iPad)
1280px  → Desktop (Standard)
1440px  → Wide Desktop (Large monitors)
```

---

## Component Breakpoint Mapping

### PolishedNavbar
```
375px:  Mobile menu (hamburger)
640px:  Still mobile menu
768px:  Still mobile menu
1024px: Desktop nav appears (md:hidden removed at lg)
1280px: Full desktop nav
1440px: Full desktop nav with spacing
```

**Issue:** md:hidden means hidden until 768px, but should show desktop nav at 1024px

---

### PolishedHeroSection
```
375px:  Single column, text-3xl heading
640px:  Single column, text-4xl heading
768px:  Single column, text-5xl heading
1024px: Two columns, text-6xl heading
1280px: Two columns, text-7xl heading
1440px: Two columns, text-7xl heading
```

**Issue:** No text-3xl for 375px, jumps to text-5xl

---

### LiveInterview (Component)
```
375px:  Single column, aspect-square video
640px:  Single column, aspect-square video
768px:  Single column, aspect-square video
1024px: Two columns, aspect-video
1280px: Two columns, aspect-video
1440px: Two columns, aspect-video
```

**Issue:** aspect-video on 375px creates 211px height

---

### FeaturesSection
```
375px:  1 column, gap-4
640px:  1 column, gap-4
768px:  2 columns, gap-6
1024px: 3 columns, gap-6
1280px: 3 columns, gap-6
1440px: 3 columns, gap-6
```

**Issue:** gap-6 too large on tablet 2-column layout

---

## Font Size Scaling

### Current Implementation
```
Heading:  text-5xl sm:text-6xl lg:text-7xl
Body:     text-base md:text-lg
Small:    text-sm (no scaling)
```

### Recommended Implementation
```
Heading:  text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl
Body:     text-sm sm:text-base md:text-lg
Small:    text-xs sm:text-sm
```

---

## Touch Target Sizes

### Current Implementation
```
Menu button:      p-2 = 8px padding = 22×22px ❌
Mobile menu item: py-3 = 12px padding = 36px height ❌
Form input:       py-2 = 8px padding = 32px height ❌
Badge:            w-4 h-4 = 16×16px ❌
```

### Recommended Implementation
```
Menu button:      p-3 sm:p-2 = 44×44px ✅
Mobile menu item: py-4 sm:py-3 = 44px height ✅
Form input:       py-3 = 44px height ✅
Badge:            w-5 h-5 = 20×20px (acceptable with padding)
```

---

## Spacing Scale

### Current Implementation
```
gap-1:  4px
gap-2:  8px
gap-3:  12px
gap-4:  16px
gap-6:  24px
gap-8:  32px
```

### Responsive Gaps
```
Mobile:   gap-2 (8px)
Tablet:   gap-3 (12px)
Desktop:  gap-4 (16px)
Wide:     gap-6 (24px)
```

---

## Grid Layouts

### Hero Section
```
375px:  grid (1 column)
768px:  grid (1 column)
1024px: grid lg:grid-cols-2 (2 columns) ❌ Should be md:grid-cols-2
1280px: grid-cols-2
1440px: grid-cols-2
```

### Features Section
```
375px:  grid (1 column)
768px:  grid md:grid-cols-2 (2 columns)
1024px: grid-cols-2
1280px: grid lg:grid-cols-3 (3 columns)
1440px: grid-cols-3
```

### Dashboard
```
375px:  grid (1 column)
768px:  grid md:grid-cols-2 (2 columns) ❌ Should be lg:grid-cols-2
1024px: grid-cols-2
1280px: grid-cols-2
1440px: grid-cols-2
```

---

## Padding Scale

### Current Implementation
```
px-4:  16px (mobile)
px-6:  24px (tablet)
px-8:  32px (desktop)
```

### Recommended Implementation
```
px-4:        16px (mobile)
sm:px-6:     24px (small)
md:px-6:     24px (tablet)
lg:px-8:     32px (desktop)
xl:px-12:    48px (wide)
2xl:px-16:   64px (extra wide)
```

---

## Responsive Utilities Needed

### Typography
```css
.text-responsive-h1 {
  @apply text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl;
}

.text-responsive-h2 {
  @apply text-2xl sm:text-3xl md:text-4xl lg:text-5xl;
}

.text-responsive-h3 {
  @apply text-xl sm:text-2xl md:text-3xl lg:text-4xl;
}

.text-responsive-body {
  @apply text-sm sm:text-base md:text-lg;
}
```

### Spacing
```css
.gap-responsive {
  @apply gap-2 sm:gap-3 md:gap-4 lg:gap-6;
}

.p-responsive {
  @apply px-4 sm:px-6 md:px-6 lg:px-8 xl:px-12;
}

.py-responsive {
  @apply py-4 sm:py-6 md:py-8 lg:py-12;
}
```

### Touch Targets
```css
.touch-target {
  @apply min-h-[44px] min-w-[44px] flex items-center justify-center;
}

.touch-target-sm {
  @apply min-h-[40px] min-w-[40px] flex items-center justify-center;
}
```

---

## Breakpoint Decision Tree

### When to use which breakpoint?

```
Mobile-first approach:
1. Write styles for mobile (375px)
2. Add sm: for 640px+
3. Add md: for 768px+ (tablet)
4. Add lg: for 1024px+ (desktop)
5. Add xl: for 1280px+ (wide)
6. Add 2xl: for 1536px+ (extra wide)

Example:
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive text
</div>
```

---

## Common Mistakes to Avoid

### ❌ Wrong
```jsx
<div className="text-5xl sm:text-6xl lg:text-7xl">
  // Jumps from default to 5xl, no mobile size
</div>
```

### ✅ Correct
```jsx
<div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
  // Scales properly at each breakpoint
</div>
```

---

### ❌ Wrong
```jsx
<button className="p-2">
  // Only 22×22px touch target
</button>
```

### ✅ Correct
```jsx
<button className="p-3 sm:p-2 min-h-[44px] min-w-[44px] flex items-center justify-center">
  // 44×44px touch target
</button>
```

---

### ❌ Wrong
```jsx
<div className="grid lg:grid-cols-2 gap-8">
  // Single column until 1024px, gap too large
</div>
```

### ✅ Correct
```jsx
<div className="grid md:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
  // Two columns at 768px, responsive gap
</div>
```

---

## Testing at Each Breakpoint

### 375px (Mobile)
- [ ] No horizontal scroll
- [ ] All text readable
- [ ] All buttons 44×44px
- [ ] Navigation collapses
- [ ] Images scale properly
- [ ] Forms are usable

### 768px (Tablet)
- [ ] Grid layouts reflow
- [ ] Spacing is appropriate
- [ ] Text is readable
- [ ] Navigation still works
- [ ] No excessive whitespace
- [ ] Modals fit on screen

### 1280px (Desktop)
- [ ] All content visible
- [ ] Spacing is balanced
- [ ] Navigation is full
- [ ] AI preview visible
- [ ] No layout shifts
- [ ] Performance is good

### 1440px (Wide)
- [ ] Max-width appropriate
- [ ] Padding scales
- [ ] Content distributed
- [ ] No excessive gaps
- [ ] Looks professional
- [ ] Performance maintained

---

## Responsive Image Strategy

### Current
```jsx
<img src="image.jpg" alt="description" />
```

### Recommended
```jsx
<img 
  src="image-lg.jpg" 
  srcSet="image-sm.jpg 375w, image-md.jpg 768w, image-lg.jpg 1280w"
  alt="description"
  className="w-full h-auto"
/>
```

---

## Performance Optimization

### CSS Media Queries
```css
/* Mobile first */
.component {
  padding: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
  }
}
```

### JavaScript Resize Handling
```javascript
// Debounce resize events
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Handle resize
  }, 250);
});
```

---

## Accessibility at Each Breakpoint

### Mobile (375px)
- [ ] Touch targets ≥ 44×44px
- [ ] Font size ≥ 16px
- [ ] Line height ≥ 1.5
- [ ] Color contrast ≥ 4.5:1
- [ ] Focus visible
- [ ] Keyboard navigation works

### Tablet (768px)
- [ ] Same as mobile
- [ ] Plus: Hover states work
- [ ] Plus: Pointer events supported

### Desktop (1280px)
- [ ] Same as tablet
- [ ] Plus: Multi-column layouts
- [ ] Plus: Complex interactions

---

## Deployment Checklist

- [ ] All breakpoints tested
- [ ] No horizontal scroll
- [ ] All touch targets ≥ 44×44px
- [ ] Font scaling consistent
- [ ] Navigation works on mobile
- [ ] Modals fit on small screens
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] No console errors
- [ ] Cross-browser tested

---

**Last Updated:** March 14, 2026  
**Status:** Ready for Implementation
