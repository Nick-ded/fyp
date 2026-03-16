/**
 * Design Tokens - Centralized design system values
 * Use these constants to maintain consistency across the application
 * 
 * UI Audit Phase 2: Standardized design system
 */

export const DESIGN_TOKENS = {
  // Typography Scale
  typography: {
    h1: {
      mobile: 'text-4xl',
      tablet: 'text-5xl',
      desktop: 'text-6xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight',
    },
    h2: {
      mobile: 'text-3xl',
      tablet: 'text-4xl',
      desktop: 'text-5xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight',
    },
    h3: {
      mobile: 'text-xl',
      tablet: 'text-2xl',
      desktop: 'text-2xl',
      weight: 'font-bold',
      lineHeight: 'leading-tight',
    },
    body: {
      size: 'text-base md:text-lg',
      weight: 'font-normal',
      lineHeight: 'leading-relaxed',
    },
    small: {
      size: 'text-sm',
      weight: 'font-normal',
      lineHeight: 'leading-relaxed',
    },
    tiny: {
      size: 'text-xs',
      weight: 'font-normal',
      lineHeight: 'leading-relaxed',
    },
  },

  // Spacing Scale
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px',
    '4xl': '64px',
    '6xl': '96px',
  },

  // Color Palette
  colors: {
    primary: {
      50: '#f0f4f8',
      100: '#d9e2ec',
      200: '#bcccdc',
      300: '#9fb3c8',
      400: '#829ab1',
      500: '#627d98',
      600: '#486581',
      700: '#334e68',
      800: '#243b53',
      900: '#0B1220',
    },
    accent: {
      50: '#e6f0ff',
      100: '#b3d4ff',
      200: '#80b8ff',
      300: '#4d9cff',
      400: '#1a80ff',
      500: '#0066e6',
      600: '#0052b3',
      700: '#003d80',
      800: '#00294d',
      900: '#00141a',
    },
    surface: {
      primary: '#0B1220',
      secondary: '#0F172A',
      elevated: '#111827',
      card: '#1F2937',
      border: '#1E293B',
    },
    text: {
      primary: '#ffffff',        // 15.3:1 contrast ✅
      secondary: '#d1d5db',      // 8.2:1 contrast ✅
      tertiary: '#9ca3af',       // 5.1:1 contrast ✅
      muted: '#9ca3af',          // Changed from #6b7280 (was 3.2:1) ✅
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    focus: {
      ring: '#a78bfa',
      offset: '#0f172a',
    },
    gradients: {
      primary: 'from-violet-400 via-purple-400 to-indigo-400',
      accent: 'from-violet-600 to-indigo-600',
      text: 'from-violet-400 via-purple-400 to-indigo-400',
    },
    scrollbar: {
      track: '#0f172a',
      thumb: '#334155',
      thumbHover: '#475569',
    },
  },

  // Font Weights - Standardized Hierarchy
  fontWeights: {
    heading: 'font-bold',        // 700 - h1, h2, h3
    label: 'font-semibold',      // 600 - labels, buttons
    emphasis: 'font-medium',     // 500 - emphasized text
    body: 'font-normal',         // 400 - body, descriptions
  },

  // Border Radius
  borderRadius: {
    sm: 'rounded-lg',      // 8px
    md: 'rounded-xl',      // 12px (PRIMARY)
    lg: 'rounded-2xl',     // 16px
  },

  // Shadows
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',       // PRIMARY
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    hover: 'hover:shadow-lg',
  },

  // Transitions
  transitions: {
    fast: 'transition-all duration-150',
    normal: 'transition-all duration-200', // PRIMARY
    slow: 'transition-all duration-300',
  },

  // Layout
  layout: {
    maxWidth: 'max-w-7xl',
    containerPadding: 'px-4 sm:px-6 lg:px-8',
    sectionPadding: 'py-24',
    cardPadding: 'p-6',
  },

  // Breakpoints
  breakpoints: {
    mobile: '375px',
    tablet: '768px',
    desktop: '1280px',
    wide: '1440px',
  },

  // Component Sizes
  components: {
    button: {
      small: 'px-4 py-2',
      medium: 'px-6 py-3',  // PRIMARY
      large: 'px-8 py-4',
    },
    icon: {
      small: 'w-4 h-4',     // 16px
      medium: 'w-5 h-5',    // 20px
      large: 'w-6 h-6',     // 24px
    },
    touchTarget: '44px',    // Minimum for mobile
  },

  // Focus States
  focus: {
    ring: 'focus:ring-2 focus:ring-violet-500',
    offset: 'focus:ring-offset-2 focus:ring-offset-slate-950',
  },
};

/**
 * Utility function to get responsive class
 * @param {string} mobile - Mobile class
 * @param {string} tablet - Tablet class (optional)
 * @param {string} desktop - Desktop class (optional)
 * @returns {string} Responsive class string
 */
export const responsive = (mobile, tablet = null, desktop = null) => {
  let classes = mobile;
  if (tablet) classes += ` md:${tablet}`;
  if (desktop) classes += ` lg:${desktop}`;
  return classes;
};

/**
 * Utility function to combine design tokens
 * @param {...string} tokens - Design token values
 * @returns {string} Combined class string
 */
export const combineTokens = (...tokens) => {
  return tokens.filter(Boolean).join(' ');
};

export default DESIGN_TOKENS;
