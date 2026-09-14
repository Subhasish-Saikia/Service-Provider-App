---
name: Service Flow
colors:
  surface: '#f9f9ff'
  surface-dim: '#d7d9e5'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3fe'
  surface-container: '#ebedf9'
  surface-container-high: '#e6e8f3'
  surface-container-highest: '#e0e2ed'
  on-surface: '#181c23'
  on-surface-variant: '#414754'
  inverse-surface: '#2d3039'
  inverse-on-surface: '#eef0fb'
  outline: '#717786'
  outline-variant: '#c1c6d7'
  surface-tint: '#005bc0'
  primary: '#0059bb'
  on-primary: '#ffffff'
  primary-container: '#0070ea'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc7ff'
  secondary: '#575f67'
  on-secondary: '#ffffff'
  secondary-container: '#d8e1ea'
  on-secondary-container: '#5b646b'
  tertiary: '#9e3d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c64f00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc7ff'
  on-primary-fixed: '#001a41'
  on-primary-fixed-variant: '#004493'
  secondary-fixed: '#dbe4ed'
  secondary-fixed-dim: '#bfc8d0'
  on-secondary-fixed: '#141d23'
  on-secondary-fixed-variant: '#3f484f'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7c2e00'
  background: '#f9f9ff'
  on-background: '#181c23'
  surface-variant: '#e0e2ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max-width: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built for a high-trust service marketplace. The brand personality is professional, efficient, and dependable. It utilizes a **Corporate / Modern** style that prioritizes clarity of information and ease of navigation. The aesthetic is clean and functional, minimizing decorative elements to ensure users can find and book services with zero friction. The target audience includes both busy homeowners seeking reliable pros and service providers managing their livelihoods, necessitating a UI that feels both premium and utilitarian.

## Colors
The palette is anchored by a vibrant Primary Blue (#007BFF) which signifies trust and action. The background uses a soft Light Gray (#F8F9FA) to reduce eye strain and provide a subtle contrast against white "Surface" containers where content lives. Secondary grays are used for non-critical information and icons, while a clear Success Green is reserved for confirmation states and completed bookings. High-contrast dark charcoal (#212529) is used for text to ensure maximum readability and accessibility.

## Typography
This design system utilizes **Inter** exclusively to maintain a systematic and utilitarian feel. The hierarchy is strictly enforced through weight and scale. Headlines use Semi-Bold or Bold weights with tight letter-spacing for a modern, "tucked-in" look. Body copy is set at 16px for optimal legibility, using a generous line height (1.6) to improve reading flow on service descriptions and reviews.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop, centering content within a 1200px container. On mobile, it transitions to a fluid 4-column system with 16px side margins. 

The vertical rhythm is based on a 4px baseline grid. 
- Use `stack-sm` (8px) for related elements like labels and inputs.
- Use `stack-md` (16px) for standard gaps between sections within a card.
- Use `stack-lg` (32px) to separate major content blocks.
Gaps between service cards in a grid should remain at 24px (gutter) to ensure clear separation of visual groups.

## Elevation & Depth
This design system employs **Ambient Shadows** and **Tonal Layers** to create a structured hierarchy. 
1. **Level 0 (Background):** #F8F9FA.
2. **Level 1 (Cards/Surfaces):** White (#FFFFFF) with a very subtle, diffused shadow: `0px 4px 12px rgba(0, 0, 0, 0.05)`.
3. **Level 2 (Hover/Active):** White (#FFFFFF) with an elevated shadow: `0px 8px 24px rgba(0, 0, 0, 0.08)`.
4. **Level 3 (Modals/Overlays):** White (#FFFFFF) with a high-contrast shadow: `0px 12px 32px rgba(0, 0, 0, 0.12)`.

No heavy borders are used; instead, depth is created by the contrast between the white surface and the light gray background.

## Shapes
The shape language is consistently **Rounded**, using a 12px (0.75rem) base radius for primary components. 
- **Small Components (Buttons, Chips):** Use 8px radius.
- **Medium Components (Cards, Modals):** Use 12px radius.
- **Large Components (Hero Sections):** Use 16px radius for internal images.

This specific roundedness level strikes a balance between professional precision and approachable warmth.

## Components
- **Buttons:** Primary buttons use the #007BFF background with white text. They should have a 12px vertical padding and 24px horizontal padding. Secondary buttons use a light gray ghost style.
- **Cards:** The most critical component. Cards must have a 12px corner radius, a white background, and the Level 1 shadow defined in the Elevation section.
- **Inputs:** Use a 1px border (#DEE2E6). On focus, the border changes to Primary Blue (#007BFF) with a 2px outer glow of the same color at 20% opacity.
- **Chips:** Used for service categories or tags. They have an 8px radius, a light blue tint background (#E7F1FF), and blue text.
- **Booking Bar:** A persistent footer component on mobile that houses the price and a "Book Now" CTA, utilizing a slight blur background (Glassmorphism) to distinguish it from the page content.
- **Lists:** Service lists should use a horizontal layout on desktop with thin dividers (#E9ECEF) and plenty of padding (20px) between items.