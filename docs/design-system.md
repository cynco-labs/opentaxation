# Design System

**Theme:** Warm, Phosphor-inspired palette with cream backgrounds and amber accents.

---

## Quick Reference

| Specification | Value |
|---------------|-------|
| Touch Targets | 48px minimum (mobile), 44px (desktop) |
| Animation Duration | 0.3s (standard), 0.2s (micro) |
| Animation Stagger | 0.02s increments |
| Border Radius | 0.75rem (default) |
| Card Hover | lift + shadow |

---

## Colors

### Core Palette (Light Mode)

| Token | HSL Value | Hex Approx | Usage |
|-------|-----------|------------|-------|
| `background` | 40 33% 96% | #f7f4ef | Main content areas (warm cream) |
| `background-secondary` | 40 25% 93% | #f0ebe3 | Alternating sections |
| `foreground` | 40 10% 15% | #2a2825 | Headlines, body text (warm charcoal) |
| `card` | 40 30% 98% | #fbfaf8 | Card backgrounds (warm white) |
| `primary` | 40 10% 20% | - | Buttons, CTA (warm dark olive) |
| `muted` | 40 15% 92% | - | Subtle backgrounds |
| `muted-foreground` | 40 8% 45% | - | Secondary text (warm gray) |
| `border` | 40 15% 85% | - | Borders and dividers |
| `surface-dark` | 40 15% 12% | - | Code blocks, terminal UI |

### Accent Colors

| Token | HSL Value | Hex Approx | Usage |
|-------|-----------|------------|-------|
| `amber` | 38 92% 50% | #f59e0b | Primary accent, highlights |
| `amber-light` | 45 93% 58% | #eab308 | Lighter accent variant |
| `destructive` | 0 72% 51% | - | Errors, warnings |

### Dark Mode

| Token | HSL Value | Hex Approx |
|-------|-----------|------------|
| `background` | 40 8% 8% | #151413 |
| `background-secondary` | 40 8% 11% | #1c1b19 |
| `foreground` | 40 15% 88% | #e3e0db |
| `primary` | 40 20% 85% | - |
| `muted-foreground` | 40 8% 55% | - |
| `border` | 40 6% 20% | - |

### Semantic Colors (Recommendation Cards)

| State | Border | Background | Usage |
|-------|--------|------------|-------|
| Sdn Bhd Better | `emerald-500/40` | `from-emerald-500/5 to-emerald-500/10` | Recommended choice |
| Enterprise Better | `blue-500/40` | `from-blue-500/5 to-blue-500/10` | Alternative choice |
| Warning | `destructive/30` | `from-destructive/5 to-destructive/10` | Alerts, caveats |
| Neutral | `border/50` | `card` | Default state |

### Semantic Colors (E-Invoicing / Status)

| State | Background | Text | Usage |
|-------|------------|------|-------|
| Exempt / Success | `emerald-500/10` | `emerald-600` (light) / `emerald-400` (dark) | Exempt status, completed items |
| Urgent (≤30 days) | `bg-amber-500` | `text-white` | Approaching deadline |
| Critical (≤14 days) | `bg-red-500` | `text-white` | Immediate action required |
| Completed | `emerald-500/5` | `emerald-500` | Checked/done state |

### Feature Icon Colors

| Category | Color | Tailwind Class |
|----------|-------|----------------|
| Financial | Emerald | `text-emerald-600` |
| Income | Amber | `text-amber-600` |
| Tax | Blue | `text-blue-600` |
| Business | Purple | `text-purple-600` |
| Growth | Rose | `text-rose-600` |
| Verification | Teal | `text-teal-600` |

---

## Typography

### Font Stack

```css
font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
```

### Letter Spacing

| Element | Letter Spacing |
|---------|----------------|
| Large headings (h1, 4xl+) | -0.035em |
| Section headings (h2-h4) | -0.025em |
| Body text | -0.011em |
| Small/muted text | 0 |

### Heading Scale

| Level | Desktop | Mobile | Weight | Usage |
|-------|---------|--------|--------|-------|
| Hero | `text-5xl`/`text-6xl` | `text-4xl` | 700 | Landing page headline |
| Section | `text-2xl`/`text-3xl` | `text-xl` | 600 | Section headers |
| Card | `text-lg`/`text-xl` | `text-base` | 600 | Card titles |
| Label | `text-sm` | `text-sm` | 400 | Form labels, metadata |

### Number Formatting

```css
.font-numbers {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
```

---

## Layout

### Breakpoints

| Name | Width | Tailwind Prefix |
|------|-------|-----------------|
| Extra Small | ≥ 375px | `xs:` |
| Mobile | < 640px | (default) |
| Tablet | ≥ 640px | `sm:` |
| Medium | ≥ 768px | `md:` |
| Desktop | ≥ 1024px | `lg:` |
| Wide | ≥ 1280px | `xl:` |

### Container

| Property | Value |
|----------|-------|
| Max Width | 1112px (`container-content`) |
| Narrow | 768px (`container-narrow`) |
| Wide | 1280px (`container-wide`) |
| Padding | `px-5 sm:px-8 lg:px-10` |

### Touch Targets

| Element | Mobile | Desktop | Tailwind |
|---------|--------|---------|----------|
| Input fields | 48px | 44px | `h-12 sm:h-11` |
| Buttons | 48px | 44px | `min-h-[48px] sm:min-h-[44px]` |
| Tab bar icons | 48px | - | `min-h-[48px]` |

### Spacing

| Context | Padding |
|---------|---------|
| Section (vertical) | `py-16 sm:py-20 lg:py-24` |
| Section small | `py-10 sm:py-12 lg:py-16` |
| Card content | `p-5 sm:p-6` |
| Mobile padding | `px-5 sm:px-6 lg:px-8` |
| Safe area (mobile) | `pb-safe` |

---

## Animation Guidelines

### Entry Animations

| Property | Value |
|----------|-------|
| Initial state | `opacity: 0, y: 10` |
| Duration | `0.3s` |
| Stagger delay | `0.02s` increments |
| Easing | `ease-out` |

### Framer Motion Easing

```ts
const smoothEase = [0.25, 0.1, 0.25, 1];
```

### Reduced Motion Support

```tsx
const prefersReducedMotion = useReducedMotion();
animate={prefersReducedMotion ? {} : { ... }}
```

---

## Components

### Primary Button (CTA)

| Property | Value |
|----------|-------|
| Height | `h-16` (hero), `h-12` (standard) |
| Padding | `px-12` (hero), `px-6` (standard) |
| Border radius | `rounded-2xl` |
| Background | `bg-foreground text-background` |
| Active | `active:scale-[0.98]` |

### Input Field

| Property | Mobile | Desktop |
|----------|--------|---------|
| Height | `h-12` (48px) | `h-11` (44px) |
| Font size | `text-base` | `text-sm` |

### Cards

```css
border border-border/50
rounded-2xl bg-card shadow-sm
hover:shadow-lg hover:-translate-y-0.5
transition-all duration-300
```

---

## Mobile Layout

### Safe Area Handling

```css
.pb-safe { padding-bottom: env(safe-area-inset-bottom, 0px); }
.pt-safe { padding-top: env(safe-area-inset-top, 0px); }
```

### Bottom Navigation

| Property | Value |
|----------|-------|
| Height | 49px |
| Background | `bg-background/80 backdrop-blur-xl` |
| Tab label size | `text-[11px]` |
| Icon size | `h-6 w-6` |

---

## Section Patterns

| Class | Usage |
|-------|-------|
| `.section-primary` | Warm cream (`bg-background`) |
| `.section-secondary` | Darker cream (`bg-background-secondary`) |
| `.section-cta` | Primary dark (`bg-primary text-primary-foreground`) |

---

## Accessibility

- Respect `prefers-reduced-motion` via `useReducedMotion()`
- All interactive elements have focus indicators
- ARIA labels on icon buttons
- Proper heading hierarchy
- Touch targets meet 44-48px minimum

---

## Mobile-Native Patterns

### Touch Optimization

| Property | Value | Tailwind |
|----------|-------|----------|
| Touch target (minimum) | 44px | `min-h-[44px]` |
| Touch manipulation | Disable double-tap zoom | `touch-manipulation` |
| Active state | Replace hover on mobile | `active:bg-muted/50` |
| Scroll behavior | Native momentum | `overscroll-contain` |

### Safe Areas

```css
.safe-area-top { padding-top: env(safe-area-inset-top, 0px); }
.safe-area-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); }
```

### Dynamic Viewport

```css
min-height: 100dvh; /* Use dvh for mobile browsers */
```

### Bottom Sheets (Modal)

| Property | Value |
|----------|-------|
| Backdrop | `bg-black/50 backdrop-blur-sm` |
| Container | `rounded-t-2xl max-h-[80vh]` |
| Handle | `w-9 h-1 rounded-full bg-border` |
| Animation | `spring: damping 28, stiffness 280` |
