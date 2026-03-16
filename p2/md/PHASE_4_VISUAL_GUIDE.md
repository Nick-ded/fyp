# Phase 4: Visual Design Guide

## Interactive States Reference

### Button States

```
┌─────────────────────────────────────────────────────────┐
│ PRIMARY BUTTON STATES                                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ DEFAULT:                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Start Interview                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Gradient: violet-600 → indigo-600)                    │
│                                                         │
│ HOVER:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Start Interview                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Darker gradient + shadow + slight lift)               │
│                                                         │
│ FOCUS:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Start Interview                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ (2px violet-400 outline, 2px offset)                   │
│                                                         │
│ ACTIVE:                                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Start Interview                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Scale 0.95, pressed appearance)                       │
│                                                         │
│ DISABLED:                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Start Interview                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Gray-500, opacity 60%, cursor not-allowed)            │
│                                                         │
│ LOADING:                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ⟳ Processing...                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Spinner + text, disabled state)                       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Card States

```
┌─────────────────────────────────────────────────────────┐
│ CARD STATES                                             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ DEFAULT:                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎯 Feature Title                                    │ │
│ │                                                     │ │
│ │ Feature description text goes here                  │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Border: slate-700, Background: slate-800)             │
│                                                         │
│ HOVER:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎯 Feature Title                                    │ │
│ │                                                     │ │
│ │ Feature description text goes here                  │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Lifted -4px, shadow increase, border lighter)         │
│                                                         │
│ FOCUS:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🎯 Feature Title                                    │ │
│ │                                                     │ │
│ │ Feature description text goes here                  │ │
│ └─────────────────────────────────────────────────────┘ │
│ (2px violet-400 outline on interactive children)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Form Input States

```
┌─────────────────────────────────────────────────────────┐
│ FORM INPUT STATES                                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ DEFAULT:                                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Enter your email...                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Border: slate-600, Background: slate-700)             │
│                                                         │
│ HOVER:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Enter your email...                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Border: slate-500)                                    │
│                                                         │
│ FOCUS:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Enter your email...                                 │ │
│ └─────────────────────────────────────────────────────┘ │
│ (2px violet-400 outline, border: violet-500)           │
│                                                         │
│ FILLED:                                                 │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ user@example.com                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Value visible, clear button on right)                 │
│                                                         │
│ ERROR:                                                  │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ user@example                                        │ │
│ └─────────────────────────────────────────────────────┘ │
│ ⚠️ Invalid email format                                │
│ (Border: red-500, error message below)                 │
│                                                         │
│ DISABLED:                                               │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ user@example.com                                    │ │
│ └─────────────────────────────────────────────────────┘ │
│ (Opacity 60%, cursor not-allowed)                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Spacing & Sizing Reference

### Button Sizes

```
Small:    px-3 py-1.5 text-sm
┌──────────────────┐
│ Small Button     │
└──────────────────┘

Medium:   px-4 py-2 text-sm
┌────────────────────────┐
│ Medium Button          │
└────────────────────────┘

Large:    px-6 py-3 text-base
┌──────────────────────────────┐
│ Large Button                 │
└──────────────────────────────┘
```

### Card Padding

```
Compact:  p-4
┌────────────────────┐
│ ┌──────────────┐   │
│ │ Content      │   │
│ └──────────────┘   │
└────────────────────┘

Standard: p-6
┌──────────────────────┐
│ ┌──────────────┐     │
│ │ Content      │     │
│ └──────────────┘     │
└──────────────────────┘

Spacious: p-8
┌────────────────────────┐
│ ┌──────────────┐       │
│ │ Content      │       │
│ └──────────────┘       │
└────────────────────────┘
```

### Icon Sizing

```
xs: 12px (w-3 h-3)
┌──┐
│██│
└──┘

sm: 16px (w-4 h-4)
┌────┐
│████│
└────┘

md: 20px (w-5 h-5)
┌──────┐
│██████│
└──────┘

lg: 24px (w-6 h-6)
┌────────┐
│████████│
└────────┘

xl: 32px (w-8 h-8)
┌──────────┐
│██████████│
└──────────┘

2xl: 40px (w-10 h-10)
┌────────────┐
│████████████│
└────────────┘
```

---

## Border-Radius Reference

```
Small:    rounded-md (6px)
┌─────────────────┐
│ Small radius    │
└─────────────────┘

Medium:   rounded-lg (8px)
┌──────────────────┐
│ Medium radius    │
└──────────────────┘

Large:    rounded-xl (12px)
┌───────────────────┐
│ Large radius      │
└───────────────────┘

Extra:    rounded-2xl (16px)
┌────────────────────┐
│ Extra radius       │
└────────────────────┘
```

---

## Color Palette

### Primary Colors
```
Violet-600:   #7c3aed (Primary action)
Indigo-600:   #4f46e5 (Secondary action)
Slate-800:    #1e293b (Card background)
Slate-700:    #334155 (Border color)
```

### Semantic Colors
```
Success:  #10b981 (Green)
Warning:  #f59e0b (Amber)
Error:    #ef4444 (Red)
Info:     #3b82f6 (Blue)
```

### Text Colors
```
Primary:   #ffffff (White)
Secondary: #d1d5db (Gray-300)
Tertiary:  #9ca3af (Gray-400)
Disabled:  #6b7280 (Gray-500)
```

---

## Shadow Reference

```
No Shadow:
┌─────────────────┐
│ Content         │
└─────────────────┘

Subtle Shadow:
┌─────────────────┐
│ Content         │
└─────────────────┘
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

Medium Shadow:
┌─────────────────┐
│ Content         │
└─────────────────┘
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔

Large Shadow:
┌─────────────────┐
│ Content         │
└─────────────────┘
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

---

## Transition Timing

```
Fast (150ms):
Start ─────────────────────────────────────────────────── End
       ▁▂▃▄▅▆▇█████████████████████████████████████████

Base (200ms):
Start ─────────────────────────────────────────────────── End
       ▁▂▃▄▅▆▇████████████████████████████████████████████

Slow (300ms):
Start ─────────────────────────────────────────────────── End
       ▁▂▃▄▅▆▇█████████████████████████████████████████████████
```

---

## Focus Indicator Reference

```
Standard Focus Ring:
┌─────────────────────────────────────────┐
│ ┌───────────────────────────────────┐   │
│ │ Interactive Element               │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
  2px violet-400 outline, 2px offset
```

---

## Hover Effects Reference

### Lift Effect
```
Default:
┌─────────────────┐
│ Content         │
└─────────────────┘

Hover (translateY -4px):
    ┌─────────────────┐
    │ Content         │
    └─────────────────┘
```

### Scale Effect
```
Default:
┌─────────────────┐
│ Content         │
└─────────────────┘

Hover (scale 1.1):
  ┌───────────────────┐
  │   Content         │
  └───────────────────┘
```

### Shadow Effect
```
Default:
┌─────────────────┐
│ Content         │
└─────────────────┘

Hover (shadow increase):
┌─────────────────┐
│ Content         │
└─────────────────┘
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔
```

---

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│ Page                                                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Section                                             │ │
│ ├─────────────────────────────────────────────────────┤ │
│ │                                                     │ │
│ │ ┌──────────────┐  ┌──────────────┐  ┌────────────┐ │ │
│ │ │ Card         │  │ Card         │  │ Card       │ │ │
│ │ ├──────────────┤  ├──────────────┤  ├────────────┤ │ │
│ │ │ ┌──────────┐ │  │ ┌──────────┐ │  │ ┌────────┐ │ │
│ │ │ │ Icon     │ │  │ │ Icon     │ │  │ │ Icon   │ │ │
│ │ │ └──────────┘ │  │ └──────────┘ │  │ └────────┘ │ │
│ │ │ Title        │  │ Title        │  │ Title      │ │ │
│ │ │ Description  │  │ Description  │  │ Description│ │ │
│ │ └──────────────┘  └──────────────┘  └────────────┘ │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoints

```
Mobile (320px - 640px):
┌──────────────────┐
│ Single Column    │
│ Layout           │
└──────────────────┘

Tablet (641px - 1024px):
┌──────────────────┬──────────────────┐
│ Two Column       │ Layout           │
└──────────────────┴──────────────────┘

Desktop (1025px+):
┌──────────────┬──────────────┬──────────────┐
│ Three Column │ Layout       │ Full Width   │
└──────────────┴──────────────┴──────────────┘
```

---

## Accessibility Indicators

```
Keyboard Focus:
┌─────────────────────────────────────────┐
│ ┌───────────────────────────────────┐   │
│ │ Interactive Element               │   │
│ └───────────────────────────────────┘   │
└─────────────────────────────────────────┘
  Visible 2px outline

Screen Reader:
aria-label="Button description"
aria-busy="true" (during loading)
aria-disabled="true" (when disabled)

Color Contrast:
Text on Background: 4.5:1 minimum
UI Components: 3:1 minimum
```

---

## Animation Easing Curves

```
Linear:
█████████████████████████████████████████

Ease In:
█░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

Ease Out:
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█

Ease In-Out:
░░░░░░░░░░░░░░░░█████████████████░░░░░░░

Cubic Bezier (0.4, 0, 0.2, 1):
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░█
```

---

## Component Checklist Template

```
Component: _______________
Status: ⬜ Not Started | 🟨 In Progress | 🟩 Complete

States:
  ☐ Default
  ☐ Hover
  ☐ Focus
  ☐ Active
  ☐ Disabled
  ☐ Loading

Accessibility:
  ☐ Keyboard navigation
  ☐ Focus indicator
  ☐ Screen reader support
  ☐ Color contrast
  ☐ ARIA labels

Responsive:
  ☐ Mobile (320px)
  ☐ Tablet (768px)
  ☐ Desktop (1024px+)

Testing:
  ☐ Visual testing
  ☐ Interaction testing
  ☐ Accessibility testing
  ☐ Cross-browser testing
```
