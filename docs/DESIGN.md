# DESIGN — GharDekho 🏠

**Direction:** Mix A + C — "Warm Saffron Energy on Deep Dark Slate" (Swiggy Dark mode aesthetic with Indian Trust signals)
**Platforms:** Mobile-first (Android priority, iOS, Responsive Web PWA)
**Source of truth:** `app/src/theme/theme.ts` (Mobile) & `app/src/theme/tokens.css` (Web/PWA)

---

## 1. Principles
1. **Trust Through Clarity:** Critical Indian rental details (Water timing, Inverter backup, Common vs Attached bathroom, Sharing cost per head) are highlighted with high-contrast badge tokens, never hidden in walls of text.
2. **Thumb-First Architecture:** All primary interactions (Search, Map Pin Inspection, Booking/Inquiry, Roommate Slot Selection) live in the bottom 40% of the screen.
3. **Warm Desi Identity in Modern Shell:** Deep dark slate canvas (`#0B0F17`) prevents OLED eye strain, illuminated by energetic Saffron-Orange (`#FF6B00`) and Trust-Emerald (`#10B981`).

---

## 2. Design Tokens

### Color Palette (Dark-First Core)
```typescript
export const darkPalette = {
  bg: '#0B0F17',             // Deep midnight slate canvas
  surface: '#151D2A',        // Elevated card background
  surfaceRaised: '#1E293B',  // Modals, bottom sheets, active chips
  border: '#27354A',         // Subtle boundary divider
  borderFocus: '#FF6B00',    // Active input border
  
  // Brand Energy
  primary: '#FF6B00',        // Energetic Saffron Orange (Swiggy/Zomato vibrancy)
  primaryHover: '#E05D00',
  onPrimary: '#FFFFFF',
  
  // Trust & Utility Accents
  accentTrust: '#10B981',    // Emerald Green (Verified Owner, Available Slot)
  accentStudent: '#8B5CF6',  // Purple (Student friendly / Split deals)
  accentWarning: '#F59E0B',  // Amber (Timing alerts e.g. Jal timing)
  
  // Typography
  text: '#F8FAFC',           // Pure contrast header & primary body
  textMuted: '#94A3B8',      // Secondary metadata & captions
  textDim: '#64748B',        // Inactive tabs & icons
  
  // Semantic Status
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  dangerSurface: 'rgba(239, 68, 68, 0.12)'
};
```

### Typography Scale
- **Display / Headers:** `Poppins` (Bold & SemiBold) — energetic, modern, excellent Devanagari numerals
- **Body & Captions:** `Noto Sans` / System Sans — maximum legibility for Hindi and English bilingual listings
- **Numbers & Prices (INR):** `JetBrains Mono` / `Poppins SemiBold` — sharp rupee amounts (e.g. `₹3,500/mo`)

```
largeTitle: 32px / 38px line-height (FontWeight: 700)
title1:     24px / 30px (FontWeight: 700)
title2:     20px / 26px (FontWeight: 600)
headline:   17px / 22px (FontWeight: 600)
body:       15px / 22px (FontWeight: 400)
caption:    13px / 18px (FontWeight: 500)
badge:      11px / 14px (FontWeight: 700, LetterSpacing: 0.5px)
```

### Spacing & Layout
- **4px Base Scale:**
  - `space-1`: 4px
  - `space-2`: 8px
  - `space-3`: 12px
  - `space-4`: 16px (Standard screen padding)
  - `space-5`: 20px
  - `space-6`: 24px
  - `space-8`: 32px

### Border Radius
- `radius-sm`: 6px (Badges, tags)
- `radius-md`: 12px (Input fields, buttons)
- `radius-lg`: 18px (Listing cards, filter chips)
- `radius-xl`: 28px (Bottom sheets, modals)
- `radius-full`: 9999px (Floating action buttons, avatars)

---

## 3. Component Interaction Rules
1. **One Primary Action per View:**
   - Listing Screen: "Chat with Owner / Call" sticky bottom bar.
   - Owner Add Property: Single prominent "Next Step" button.
2. **Touch Targets:** Minimum 48x48dp for all buttons, chips, and map markers.
3. **Four Universal States:**
   - `Loading`: Skeleton shimmer matching the card shape.
   - `Empty`: Empathetic illustration + clear CTA (e.g., "No rooms found within 5km — expand radius?").
   - `Error`: Inline retry banner with clear offline/network explanation.
   - `Partial/Offline`: Stored cache with "Viewing saved listings (Offline)" pill.

---

## 4. History
| Date | Change | Why |
|---|---|---|
| 2026-11-10 | Direction selected: Mix A + C | Combining Swiggy-style dark mode with Indian saffron trust and student energy |

