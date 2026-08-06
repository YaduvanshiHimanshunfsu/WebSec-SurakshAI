---
name: Luminous Narrative
colors:
  surface: '#f9f9ff'
  surface-dim: '#cfdaf2'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f3ff'
  surface-container: '#e7eeff'
  surface-container-high: '#dee8ff'
  surface-container-highest: '#d8e3fb'
  on-surface: '#111c2d'
  on-surface-variant: '#464554'
  inverse-surface: '#263143'
  inverse-on-surface: '#ecf1ff'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#516072'
  on-secondary: '#ffffff'
  secondary-container: '#d2e1f7'
  on-secondary-container: '#556477'
  tertiary: '#595c61'
  on-tertiary: '#ffffff'
  tertiary-container: '#72747a'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#e1e2e8'
  tertiary-fixed-dim: '#c5c6cc'
  on-tertiary-fixed: '#191c20'
  on-tertiary-fixed-variant: '#44474c'
  background: '#f9f9ff'
  on-background: '#111c2d'
  surface-variant: '#d8e3fb'
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
    fontSize: 28px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: 0.04em
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
  xxl: 64px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
---

## Brand & Style

This design system evolves the "Cyber-Refined" aesthetic into a light-mode expression characterized by clarity, airiness, and high-fidelity precision. It targets professional SaaS environments that require a balance between technical sophistication and approachability. 

The design style is a hybrid of **Minimalism** and **Glassmorphism**. It utilizes expansive white space, a restrained color palette, and sophisticated translucent layers to create a sense of organized depth. The emotional response is one of calm efficiency, transparency, and modern elegance. Surfaces should feel like etched glass sitting atop a pristine, ethereal environment, moving away from aggressive "cyber" glows toward soft, natural light diffusion.

## Colors

The palette is anchored by a high-purity white base, utilizing light lavender-tinted surfaces to define functional areas without sacrificing the "airy" feel.

- **Primary Indigo (#6366f1):** Used strictly for high-priority actions, focus states, and meaningful accents. It should appear as a sharp, deliberate point of interest against the light backdrop.
- **Surface Lavender (#f8f9ff):** Applied to secondary containers, sidebars, and card backgrounds to create subtle structural contrast.
- **Border Slate (#e2e8f0):** Low-contrast boundaries that define shapes without creating visual noise.
- **Neutral Text (#1e293b):** A deep charcoal (rather than pure black) to maintain readability while feeling softer on the eyes against white backgrounds.

## Typography

This design system utilizes **Plus Jakarta Sans** across all levels to maintain a contemporary, geometric, and highly professional appearance. 

The typographic hierarchy relies on significant weight contrast rather than color shifts. Headlines utilize tight letter-spacing and bold weights to command attention, while body text is given ample line height for maximum legibility in data-heavy SaaS contexts. Labels use increased letter-spacing and semi-bold weights to remain distinct at smaller scales. For mobile, headline sizes are scaled down to prevent excessive line-breaking while maintaining the font's characteristic "open" feel.

## Layout & Spacing

The layout philosophy follows a **Fluid Grid** model with generous safe areas to reinforce the airy narrative. 

- **Desktop:** 12-column grid with 24px gutters. Content should be centered with a maximum readable width of 1440px. 
- **Tablet:** 8-column grid with 20px gutters. 
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.

The spacing rhythm is based on a 4px baseline, but defaults to 8px increments (8, 16, 24, 40) for most component spacing to ensure a clean, breathable interface. Vertical rhythm should prioritize "white-space as a separator" over heavy horizontal rules.

## Elevation & Depth

Hierarchy is established through **High-Fidelity Glassmorphism** and soft, multi-layered shadows. 

1. **Base Level:** The primary background is #ffffff.
2. **Surface Level:** Floating cards and containers use a background of `rgba(255, 255, 255, 0.7)` with a `backdrop-filter: blur(12px)`. 
3. **Borders:** Surfaces are defined by a 1px solid border (#e2e8f0) or a subtle white highlight on the top edge to simulate light hitting an edge.
4. **Shadows:** Avoid harsh, dark shadows. Use diffused, low-opacity indigo-tinted shadows: `0 10px 25px -5px rgba(99, 102, 241, 0.05)`. This creates a sense of "lift" without weight.

## Shapes

The shape language is consistently **Rounded**, providing a soft, approachable contrast to the precise typography. 

- **Standard Elements:** 0.5rem (8px) corner radius for buttons, inputs, and small widgets.
- **Large Containers:** 1rem (16px) for cards and main content areas.
- **Interactive Highlighting:** Use a slightly tighter radius (6px) for nested items inside cards to maintain visual harmony.
- **Strictness:** Avoid sharp 0px corners entirely, as they conflict with the friendly, light-mode narrative.

## Components

- **Buttons:** Primary buttons use a solid indigo (#6366f1) fill with white text. Secondary buttons are "Ghost" style: transparent background, 1px border (#e2e8f0), and text in indigo. 
- **Inputs:** Fields should have a light lavender background (#f8f9ff) and a subtle border. On focus, the border transitions to indigo with a soft 4px outer glow of the same color.
- **Cards:** Utilize the glassmorphic stack—semi-transparent white background, backdrop blur, and a soft shadow.
- **Chips:** Small, rounded-pill shapes with light lavender backgrounds and indigo text. Use for tags and categories.
- **Lists:** Items should be separated by whitespace or a very faint 1px divider (#f1f5f9). Use a subtle #f8f9ff background change on hover to indicate interactivity.
- **Navigation:** The top navigation bar should be a persistent glass layer (`backdrop-filter: blur(20px)`) to allow content to scroll behind it beautifully.