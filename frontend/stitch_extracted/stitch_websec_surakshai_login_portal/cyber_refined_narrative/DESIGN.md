---
name: Cyber-Refined Narrative
colors:
  surface: '#fcf8ff'
  surface-dim: '#dbd8e4'
  surface-bright: '#fcf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fe'
  surface-container: '#efecf8'
  surface-container-high: '#e9e6f3'
  surface-container-highest: '#e4e1ed'
  on-surface: '#1b1b23'
  on-surface-variant: '#464554'
  inverse-surface: '#303038'
  inverse-on-surface: '#f2effb'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#6b38d4'
  on-secondary: '#ffffff'
  secondary-container: '#8455ef'
  on-secondary-container: '#fffbff'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#fcf8ff'
  on-background: '#1b1b23'
  surface-variant: '#e4e1ed'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  2xl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

The design system is engineered for a high-stakes cybersecurity environment, blending the precision of technical tooling with the approachability of a premium SaaS product. The aesthetic is rooted in **Modern Corporate** efficiency, elevated by **Glassmorphism** and subtle **Vaporwave** accents to signify cutting-edge AI capabilities.

The UI should evoke a sense of "Calm Authority." It uses heavy whitespace and a sophisticated layering system to prevent data density from becoming overwhelming. Motion is a core pillar: staggered entrances and shimmer effects provide a tactile, responsive feel that suggests the system is "alive" and actively monitoring threats.

## Colors

The palette utilizes a "Hyper-Functional" logic. The Indigo primary and Violet secondary colors drive the core brand identity and interactive states. 

- **Primary & Secondary:** Used for high-priority actions, focus states, and the "Rainbow Shimmer" border gradients.
- **Accents:** Pink is reserved for security alerts, AI-driven insights, or anomalous data points. Green signifies system health and verified assets.
- **Surface:** The background is a cool, near-white blue (`#f8faff`) to reduce eye strain and differentiate from standard generic white backgrounds.

## Typography

This design system pairs the expressive, geometric nature of **Plus Jakarta Sans** for headers with the utilitarian clarity of **Inter** for data-heavy body content. 

Headlines use tight letter spacing and heavy weights (up to 800 for branding) to create a visual "anchor" on the page. Labels and small text utilize slightly increased letter spacing and a medium weight (500-600) to ensure maximum legibility within complex dashboards and dense security tables.

## Layout & Spacing

The design system employs a **12-column fluid grid** with a maximum content width of 1440px. 

- **Grid:** Use a 24px gutter for desktop and 16px for mobile.
- **Rhythm:** An 8px linear scale (base 4px) governs all padding and margins. 
- **Adaptation:** On mobile devices, complex data tables should collapse into "card" views. Side navigation transforms into a bottom-sheet or a full-screen overlay to prioritize the data visualization workspace.

## Elevation & Depth

Hierarchy is established through **Glassmorphic layering** rather than traditional heavy shadows.

- **Level 1 (Base):** The #f8faff background.
- **Level 2 (Cards):** Surfaces use `rgba(255, 255, 255, 0.72)` with a 24px backdrop-blur. Borders are 1px solid `rgba(255, 255, 255, 0.5)`.
- **Level 3 (Modals/Popovers):** Deeper blurs (40px) and a very soft, diffused shadow (`0 20px 40px rgba(0, 0, 0, 0.04)`) to separate the element from the blurred background.
- **Interactive Depth:** On hover, cards should slightly scale (1.02x) and the "Rainbow Shimmer" border should increase in opacity.

## Shapes

The shape language is "Softly Geometric." 

- **Standard Radius:** 0.5rem (8px) is applied to most UI components like inputs and small buttons.
- **Large Radius:** 1rem (16px) is reserved for primary dashboard cards and containers.
- **Pill Shapes:** Used exclusively for status chips (e.g., "Active," "Resolved") and the main primary action buttons to make them instantly recognizable.

## Components

### Buttons
- **Primary:** Gradient background (Indigo to Violet). On hover, a "shimmer" effect passes over the button. 
- **Loading State:** The button maintains its gradient but displays a "scanning" shimmer animation.

### Cards
- Always semi-transparent with backdrop-blur. 
- **Rainbow Border:** Critical security cards feature a 2px animated gradient border that rotates slowly, drawing the eye without being distracting.

### Input Fields
- **High-Fidelity:** Focus states use a dual-border; the inner is the primary color, the outer is a soft glow.
- **Password Strength:** Displayed as a 4-segment bar below the input. Segments animate from Error Red to Success Green based on complexity.

### Chips & Lists
- **Chips:** Low-opacity background tints of the status color (e.g., light green background for Success Green text).
- **Staggered Entrance:** When a list or grid of cards loads, elements must fade in and slide up 10px with a 50ms delay between each item.

### Additional Components
- **Threat Gauge:** A semi-circular radial chart for the main dashboard using the Accent Pink color for "High Risk."
- **Terminal View:** A stylized monospaced code block for log inspection, using a darker shade of the background color to create a "recessed" look.