# Phase 4: Component Fixes - Implementation Guide

## Quick Reference: Critical Fixes

### 1. Standardized Button Component
Create `p2/frontend/src/components/Button.jsx`:

```jsx
import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  ...props 
}) => {
  const baseStyles = "font-medium transition-all duration-200 flex items-center justify-center gap-2 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2"
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/30 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-violet-400",
    secondary: "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-violet-400",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-red-400"
  }
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  }
  
  return (
    <motion.button
      whileHover={!disabled && !loading ? { y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      aria-busy={loading}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </>
      )}
    </motion.button>
  )
}

export default Button
```


### 2. Standardized Card Component
Create `p2/frontend/src/components/Card.jsx`:

```jsx
import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ 
  children, 
  variant = 'default',
  hover = true,
  className = '',
  ...props 
}) => {
  const baseStyles = "rounded-xl border border-slate-700 bg-slate-800 transition-all duration-300"
  
  const variants = {
    default: "hover:border-slate-600 hover:bg-slate-700 hover:shadow-lg hover:shadow-violet-500/10",
    elevated: "border-slate-600 bg-slate-700 hover:border-slate-500 hover:shadow-lg",
    ghost: "border-transparent bg-transparent hover:bg-white/5"
  }
  
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default Card
```

### 3. Standardized Badge Component
Create `p2/frontend/src/components/Badge.jsx`:

```jsx
import React from 'react'

const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const baseStyles = "font-bold rounded-full inline-flex items-center justify-center"
  
  const variants = {
    primary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white",
    secondary: "bg-slate-700 text-gray-200",
    success: "bg-green-600 text-white",
    warning: "bg-amber-600 text-white",
    error: "bg-red-600 text-white"
  }
  
  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base"
  }
  
  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

export default Badge
```

### 4. Fix EnhancedResumeUpload.jsx - Add Focus States

Replace the drag-drop area className:

```jsx
className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-400 ${
  dragActive
    ? 'border-violet-500 bg-violet-50'
    : 'border-gray-300 bg-gray-50 hover:border-violet-400'
} ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
```

Replace upload button:

```jsx
<button
  onClick={handleUpload}
  disabled={!file || uploading}
  className={`mt-6 w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 ${
    !file || uploading
      ? 'bg-gray-500 cursor-not-allowed opacity-60 text-gray-300'
      : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-violet-500/30 active:scale-95'
  }`}
  aria-busy={uploading}
>
```

### 5. Fix UploadForm.jsx - Add Focus States

Same changes as EnhancedResumeUpload.jsx

### 6. Consolidate Navbars - Use PolishedNavbar.jsx

Delete `Navbar.jsx` and `SimpleNavbar.jsx`  
Rename `PolishedNavbar.jsx` to `Navbar.jsx`

Update `src/components/index.js`:
```jsx
export { default as Navbar } from './Navbar'
// Remove old exports
```

### 7. Fix ScoreCard.jsx - Simplify Visual Hierarchy

```jsx
import React from 'react'

function ScoreCard({ score }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-amber-400'
    return 'text-red-400'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Needs Improvement'
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-6">Confidence Score</h2>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)} mb-4`}>
            {score}
          </div>
          <p className="text-sm text-gray-400">{getScoreLabel(score)}</p>
        </div>
      </div>
    </div>
  )
}

export default ScoreCard
```

### 8. Fix HowItWorks.jsx - Add Focus States

Update step card className:

```jsx
className="card rounded-xl p-6 text-center card-hover shadow-md hover:shadow-lg transition-shadow focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-violet-400"
```

Update step number:

```jsx
<div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-slate-950 rounded-full flex items-center justify-center border-2 border-white/20 transition-all duration-300 group-hover:border-violet-500 group-hover:bg-violet-500/10">
  <span className="text-sm font-bold">{index + 1}</span>
</div>
```

### 9. Fix FeatureCard.jsx - Add Icon Scale

```jsx
<div className="w-14 h-14 bg-gradient-accent rounded-xl flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
  <Icon className="w-7 h-7 text-white" />
</div>
```

### 10. Fix Footer.jsx - Add Focus States

Update link className:

```jsx
className="text-gray-400 hover:text-white text-sm transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 rounded px-1"
```

Update social icons:

```jsx
<motion.a 
  href="#" 
  whileHover={{ scale: 1.2, rotate: 5 }}
  whileTap={{ scale: 0.95 }}
  className="text-gray-400 hover:text-white transition-colors duration-200"
>
  <Github className="w-5 h-5" />
</motion.a>
```

### 11. Add Keyboard Support to All Navbars

Add to useEffect in navbar:

```jsx
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === 'Escape' && isOpen) {
      setIsOpen(false)
    }
  }
  window.addEventListener('keydown', handleEscape)
  return () => window.removeEventListener('keydown', handleEscape)
}, [isOpen])
```

### 12. Fix Charts.jsx - Add Empty/Loading States

```jsx
const [isLoading, setIsLoading] = useState(false)

if (isLoading) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-slate-700 rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-slate-700 rounded"></div>
        </div>
      ))}
    </div>
  )
}

if (!facialMetrics || !speechMetrics) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-slate-800 border border-slate-700 rounded-xl p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-4xl mb-3">📊</div>
            <p className="text-gray-400">No metrics data available</p>
            <p className="text-sm text-gray-500 mt-2">Complete an interview to see analysis</p>
          </div>
        </div>
      ))}
    </div>
  )
}
```

---

## CSS Updates for index.css

Add these standardized utilities:

```css
/* Standardized transitions */
.transition-fast { @apply transition-all duration-150; }
.transition-base { @apply transition-all duration-200; }
.transition-slow { @apply transition-all duration-300; }

/* Standardized easing */
.ease-smooth { @apply cubic-bezier(0.4, 0, 0.2, 1); }
.ease-bounce { @apply cubic-bezier(0.68, -0.55, 0.265, 1.55); }

/* Icon sizing guide */
.icon-xs { @apply w-3 h-3; }
.icon-sm { @apply w-4 h-4; }
.icon-md { @apply w-5 h-5; }
.icon-lg { @apply w-6 h-6; }
.icon-xl { @apply w-8 h-8; }
.icon-2xl { @apply w-10 h-10; }

/* Standardized card styles */
.card-standard {
  @apply rounded-xl border border-slate-700 bg-slate-800 transition-all duration-300;
}

.card-standard:hover {
  @apply border-slate-600 bg-slate-700 shadow-lg shadow-violet-500/10;
}

/* Focus state for all interactive elements */
.focus-ring {
  @apply focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400;
}
```

---

## Implementation Priority

1. **Week 1**: Create Button, Card, Badge components
2. **Week 2**: Update all components to use new components
3. **Week 3**: Add focus states and keyboard support
4. **Week 4**: Test and polish animations
