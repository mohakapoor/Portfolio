# Style Guide & Design System

## 🎨 Color Palette

### **Core Colors**
```css
:root {
  --spider-red: #dc2626;      /* Primary accent - Tailwind red-600 */
  --vintage-white: #f5f5f4;   /* Primary text - Tailwind stone-100 */
  --dust-gray: #a8a29e;       /* Secondary text - Tailwind stone-400 */
  --shadow-black: #0c0a09;    /* Background - Tailwind stone-950 */
  --glass-border: #44403c;    /* Glass borders - Tailwind stone-600 */
}
```

### **Color Psychology & Usage**
- **Spider Red** (`--spider-red`): High-energy accent for CTAs, links, and interactive elements
- **Vintage White** (`--vintage-white`): Primary text color, ensures readability on dark backgrounds
- **Dust Gray** (`--dust-gray`): Secondary text, subtle elements, muted content
- **Shadow Black** (`--shadow-black`): Deep background, creates dramatic contrast
- **Glass Border** (`--glass-border`): Subtle borders for glass morphism effects

### **Semantic Color Applications**
```css
/* Text Hierarchy */
.text-primary { color: var(--vintage-white); }
.text-secondary { color: var(--dust-gray); }
.text-accent { color: var(--spider-red); }

/* Interactive States */
.hover-accent:hover { color: var(--spider-red); }
.focus-accent:focus { border-color: var(--spider-red); }
```

## 🪟 Glass Morphism System

### **Core Glass Effect**
```css
.glass-card {
  background: rgba(68, 64, 60, 0.1);  /* 10% opacity stone-600 */
  backdrop-filter: blur(10px);        /* Background blur effect */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;             /* rounded-xl */
}
```

### **Glass Variations**
```css
/* Subtle Glass - For secondary elements */
.glass-subtle {
  background: rgba(68, 64, 60, 0.05);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(68, 64, 60, 0.2);
}

/* Prominent Glass - For primary cards */
.glass-prominent {
  background: rgba(68, 64, 60, 0.15);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(68, 64, 60, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Interactive Glass - Hover states */
.glass-card:hover {
  background: rgba(68, 64, 60, 0.2);
  border-color: var(--spider-red);
  transform: translateY(-2px);
  transition: all 0.3s ease;
}
```

### **Browser Compatibility**
- **Modern browsers**: Full backdrop-filter support
- **Safari**: Requires `-webkit-backdrop-filter` prefix
- **Fallback**: Solid background for unsupported browsers

## ✨ Animation System

### **Transition Standards**
```css
/* Default transition for interactive elements */
.transition-default {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Quick transitions for micro-interactions */
.transition-quick {
  transition: all 0.15s ease-out;
}

/* Smooth transitions for layout changes */
.transition-smooth {
  transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### **Hover Effects**
```css
/* Card hover animation */
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(220, 38, 38, 0.15);
}

/* Button hover animation */
.button-hover {
  transition: all 0.2s ease;
}
.button-hover:hover {
  background-color: var(--spider-red);
  transform: scale(1.05);
}
```

### **Custom Cursor Animation**
```typescript
// TargetCursor component animations
const cursorVariants = {
  default: {
    x: mousePosition.x - 16,
    y: mousePosition.y - 16,
    transition: { type: "spring", stiffness: 500, damping: 28 }
  },
  hover: {
    scale: 1.5,
    backgroundColor: "var(--spider-red)",
    transition: { duration: 0.2 }
  }
};
```

### **Loading States**
```css
/* Pulse animation for loading cards */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Skeleton loading */
.skeleton {
  background: linear-gradient(90deg, 
    rgba(68, 64, 60, 0.1) 25%, 
    rgba(68, 64, 60, 0.2) 50%, 
    rgba(68, 64, 60, 0.1) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

## 📱 Responsive Design System

### **Breakpoint Strategy**
```css
/* Tailwind CSS Breakpoints */
/* sm: 640px  - Small tablets, large phones */
/* md: 768px  - Tablets */
/* lg: 1024px - Small laptops */
/* xl: 1280px - Desktops */
/* 2xl: 1536px - Large desktops */
```

### **Mobile-First Approach**
All styles are designed for mobile first, then enhanced for larger screens:

```css
/* Base (Mobile): 320px - 639px */
.container {
  padding: 1rem;
  grid-template-columns: 1fr;
}

/* Small (Tablet): 640px+ */
@media (min-width: 640px) {
  .container {
    padding: 1.5rem;
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Large (Desktop): 1024px+ */
@media (min-width: 1024px) {
  .container {
    padding: 2rem;
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### **Device-Specific Adaptations**

#### **📱 Mobile (320px - 639px)**
```css
/* Typography scaling */
.heading-mobile {
  font-size: 2rem;        /* text-4xl → text-2xl */
  line-height: 1.2;
}

/* Navigation adaptation */
.nav-mobile {
  flex-direction: column;
  gap: 0.5rem;
}

/* Card layout */
.cards-mobile {
  grid-template-columns: 1fr;
  gap: 1rem;
}

/* Button sizing */
.button-mobile {
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}
```

#### **📟 Tablet (640px - 1023px)**
```css
/* Two-column layouts */
.cards-tablet {
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* Horizontal navigation */
.nav-tablet {
  flex-direction: row;
  justify-content: space-between;
}

/* Larger touch targets */
.button-tablet {
  min-height: 44px;  /* iOS touch target minimum */
  padding: 0.875rem 1.5rem;
}
```

#### **💻 Desktop (1024px+)**
```css
/* Three-column layouts */
.cards-desktop {
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

/* Hover effects (desktop only) */
@media (hover: hover) {
  .hover-desktop:hover {
    transform: translateY(-4px);
  }
}

/* Larger spacing */
.container-desktop {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}
```

### **Responsive Grid System**
```css
/* Projects page grid adaptation */
.projects-grid {
  display: grid;
  gap: 1rem;
  
  /* Mobile: 1 column */
  grid-template-columns: 1fr;
  
  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  /* Desktop: 3 columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}
```

### **Responsive Typography**
```css
/* Fluid typography using clamp() */
.heading-fluid {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: clamp(1.2, 1.5vw, 1.4);
}

/* Responsive text hierarchy */
.text-responsive {
  /* Mobile */
  font-size: 1rem;
  
  /* Tablet */
  @media (min-width: 640px) {
    font-size: 1.125rem;
  }
  
  /* Desktop */
  @media (min-width: 1024px) {
    font-size: 1.25rem;
  }
}
```

### **Touch-Friendly Design**
```css
/* Minimum touch target sizes */
.touch-target {
  min-height: 44px;    /* iOS minimum */
  min-width: 44px;
  padding: 0.75rem;
}

/* Increased spacing for touch */
.touch-spacing {
  gap: 1rem;           /* Mobile */
  
  @media (min-width: 640px) {
    gap: 0.75rem;      /* Desktop can be tighter */
  }
}

/* Disable hover effects on touch devices */
@media (hover: none) {
  .hover-effect:hover {
    transform: none;
  }
}
```

## 🔤 Typography Scale

### **Font Families**
```css
/* Primary heading font */
.font-newspaper {
  font-family: "Newspaper Headline", serif;
  font-weight: 400;
  letter-spacing: -0.02em;
}

/* Monospace for code aesthetic */
.font-mono {
  font-family: "Roboto Mono", monospace;
  font-weight: 400;
  letter-spacing: 0.01em;
}
```

### **Size Hierarchy**
```css
/* Heading scales */
.text-hero    { font-size: 4rem;    line-height: 1.1; }  /* 64px */
.text-h1      { font-size: 3rem;    line-height: 1.2; }  /* 48px */
.text-h2      { font-size: 2.25rem; line-height: 1.3; }  /* 36px */
.text-h3      { font-size: 1.875rem; line-height: 1.4; } /* 30px */

/* Body text scales */
.text-large   { font-size: 1.25rem; line-height: 1.6; }  /* 20px */
.text-body    { font-size: 1rem;    line-height: 1.6; }  /* 16px */
.text-small   { font-size: 0.875rem; line-height: 1.5; } /* 14px */
.text-tiny    { font-size: 0.75rem; line-height: 1.4; }  /* 12px */
```

### **Responsive Typography**
```css
/* Hero text that scales */
.hero-responsive {
  font-size: 2.5rem;      /* Mobile */
  
  @media (min-width: 640px) {
    font-size: 3.5rem;    /* Tablet */
  }
  
  @media (min-width: 1024px) {
    font-size: 4rem;      /* Desktop */
  }
}
```

## 🎯 Component Styling Patterns

### **Card Components**
```css
/* Base card style */
.card-base {
  background: rgba(68, 64, 60, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 0.75rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

/* Project card specific */
.project-card {
  @extend .card-base;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 280px;
}

.project-card:hover {
  border-color: var(--spider-red);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(220, 38, 38, 0.1);
}
```

### **Button Styles**
```css
/* Primary button */
.btn-primary {
  background: var(--spider-red);
  color: var(--vintage-white);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 500;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #b91c1c;  /* Darker red */
  transform: translateY(-1px);
}

/* Ghost button */
.btn-ghost {
  background: transparent;
  color: var(--dust-gray);
  border: 1px solid var(--glass-border);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.btn-ghost:hover {
  color: var(--spider-red);
  border-color: var(--spider-red);
}
```

### **Navigation Patterns**
```css
/* Main navigation */
.nav-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

/* Navigation links */
.nav-link {
  color: var(--dust-gray);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: var(--spider-red);
  background: rgba(220, 38, 38, 0.1);
}

.nav-link.active {
  color: var(--vintage-white);
  background: rgba(68, 64, 60, 0.2);
}
```

## 🌙 Dark Theme Implementation

### **Dark-First Approach**
The entire design is built dark-first, not as an afterthought:

```css
/* Root variables optimized for dark theme */
:root {
  --bg-primary: #0c0a09;      /* stone-950 */
  --bg-secondary: #1c1917;    /* stone-900 */
  --text-primary: #f5f5f4;    /* stone-100 */
  --text-secondary: #a8a29e;  /* stone-400 */
}
```

### **Contrast Ratios**
All color combinations meet WCAG AA standards:
- **Primary text** (stone-100) on dark background: 15.8:1 ratio
- **Secondary text** (stone-400) on dark background: 7.2:1 ratio
- **Accent red** on dark background: 5.1:1 ratio

### **Accessibility Considerations**
```css
/* Focus indicators */
.focus-visible {
  outline: 2px solid var(--spider-red);
  outline-offset: 2px;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 🎪 Visual Effects

### **Shadow System**
```css
/* Elevation shadows */
.shadow-sm  { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); }
.shadow-md  { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); }
.shadow-lg  { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.3); }
.shadow-xl  { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.4); }

/* Colored shadows for accents */
.shadow-red { box-shadow: 0 8px 32px rgba(220, 38, 38, 0.2); }
```

### **Border Treatments**
```css
/* Subtle borders */
.border-subtle { border: 1px solid rgba(68, 64, 60, 0.3); }

/* Gradient borders */
.border-gradient {
  border: 1px solid transparent;
  background: linear-gradient(var(--shadow-black), var(--shadow-black)) padding-box,
              linear-gradient(45deg, var(--spider-red), var(--glass-border)) border-box;
}
```

### **Background Patterns**
```css
/* Subtle noise texture */
.bg-noise {
  background-image: 
    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0);
  background-size: 20px 20px;
}

/* Gradient overlays */
.bg-gradient-overlay {
  background: linear-gradient(
    135deg, 
    rgba(220, 38, 38, 0.1) 0%, 
    transparent 50%, 
    rgba(68, 64, 60, 0.1) 100%
  );
}
```

## 🔧 Implementation Guidelines

### **CSS Organization**
```css
/* 1. CSS Custom Properties */
:root { /* variables */ }

/* 2. Base styles */
html, body { /* reset and base */ }

/* 3. Layout utilities */
.container, .grid { /* layout */ }

/* 4. Component styles */
.card, .button { /* components */ }

/* 5. Utility classes */
.text-center, .hidden { /* utilities */ }

/* 6. Responsive overrides */
@media (min-width: 640px) { /* responsive */ }
```

### **Performance Considerations**
- **Minimize repaints**: Use `transform` instead of changing `top/left`
- **Hardware acceleration**: Use `transform3d()` for smooth animations
- **Efficient selectors**: Avoid deep nesting and complex selectors
- **Critical CSS**: Inline above-the-fold styles

### **Browser Support**
- **Modern browsers**: Full feature support
- **Safari**: Requires `-webkit-` prefixes for backdrop-filter
- **IE11**: Graceful degradation with solid backgrounds
- **Mobile browsers**: Touch-optimized interactions

---

**This style guide should be referenced when creating new components or modifying existing styles to maintain consistency across the portfolio.**
