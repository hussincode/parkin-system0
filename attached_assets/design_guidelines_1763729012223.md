# Smart Parking System - Design Guidelines

## Design Approach

**Selected Approach:** Design System - Material Design
**Justification:** This parking management system prioritizes efficiency, data clarity, and mobile functionality. Material Design provides excellent form components, clear hierarchy, and mobile-first patterns ideal for utility applications with camera integration and data tables.

## Typography System

**Font Family:** Inter (via Google Fonts CDN)
- **Display/Headers:** 700 weight, tracking-tight
- **Body Text:** 400 weight, leading-relaxed
- **Data/Numbers:** 500 weight, tabular-nums for alignment
- **Buttons/Labels:** 600 weight, uppercase for primary actions

**Scale:**
- Page Titles: text-3xl (mobile) / text-4xl (desktop)
- Section Headers: text-xl / text-2xl
- Card Titles: text-lg
- Body/Forms: text-base
- Table Data: text-sm
- Helper Text: text-xs

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Margins between elements: m-2 or m-4
- Card internal spacing: p-6

**Container Strategy:**
- Max width: max-w-4xl for forms and content
- Full width: w-full for tables and scanner
- Centered: mx-auto for primary content

## Core Components

### 1. Home Page Navigation
- Large icon buttons (w-full, h-32) in grid-cols-1 md:grid-cols-3
- Each card contains: icon (size-12), title (text-xl), subtitle (text-sm)
- Rounded corners: rounded-xl
- Shadow: shadow-md with hover:shadow-lg
- Icons: Use Heroicons (solid variants) via CDN

### 2. Registration Form
- Single column layout: max-w-md mx-auto
- Input fields: h-12, rounded-lg, px-4
- Labels: text-sm, mb-2, block
- QR display area: aspect-square, max-w-xs, centered
- Download button: w-full, h-12, rounded-lg
- Success state shows QR in bordered card with p-8

### 3. QR Scanner Interface
- Full viewport scanner area: min-h-screen
- Camera preview: aspect-video, rounded-lg, overflow-hidden
- Control buttons positioned at bottom: fixed bottom-8
- Status messages: absolute top-4, full width with mx-4
- Scanner frame: border-4, rounded-2xl overlay

### 4. Visits Log Table
- Responsive table with horizontal scroll on mobile
- Header row: font-semibold, border-b-2
- Data rows: border-b, hover:bg-gray-50
- Cell padding: px-4 py-3
- Action buttons: icon-only on mobile, text on desktop
- Export button: top-right, gap-2 with download icon

### 5. Toast Notifications
Use react-hot-toast with:
- Success: rounded-lg, p-4, min-w-[300px]
- Warning: same sizing
- Position: top-center
- Duration: 3000ms for info, 5000ms for errors

## Component Library Details

**Cards:**
- Border: border, rounded-xl
- Padding: p-6
- Shadow: shadow-sm
- Spacing between: gap-6

**Buttons:**
- Primary: h-12, px-6, rounded-lg, font-semibold
- Secondary: h-10, px-4, rounded-md, font-medium
- Icon buttons: size-10, rounded-full
- Full width on mobile: w-full sm:w-auto

**Forms:**
- Input height: h-12
- Border radius: rounded-lg
- Focus ring: ring-2, ring-offset-2
- Error states: border-2 with error text-sm mt-1
- Required fields: asterisk in label

**Tables:**
- Striped rows: even:bg-gray-50
- Compact on mobile: text-sm
- Sticky header: sticky top-0
- Responsive: overflow-x-auto wrapper

## Bilingual Support

**RTL/LTR Handling:**
- Use dir="rtl" for Arabic, dir="ltr" for English
- Flip padding/margins: pr/pl swap automatically
- Icons: position dynamically based on direction
- Text alignment: text-right for RTL, text-left for LTR

**Language Toggle:**
- Position: top-right corner, size-10 rounded button
- Icons: Use language code (AR/EN) as text-xs

## Mobile-First Specifications

**Breakpoints:**
- Mobile (default): Single column, full width buttons
- Tablet (md:640px): Two-column where appropriate
- Desktop (lg:1024px): Three-column navigation grid

**Touch Targets:**
- Minimum: h-12 (48px) for all interactive elements
- Spacing between: gap-4 minimum
- Scanner controls: h-14 for easier tap

## Page-Specific Layouts

**Home:** 3-card grid with equal height cards, centered layout with py-12
**Register:** Centered form card with max-w-md, step indicator if multi-step
**Scanner:** Full-screen camera with minimal UI overlay, controls at bottom
**Visits Log:** Table card with toolbar (refresh, export) in header, pagination at bottom

## Animations

**Minimal Motion:**
- Button hover: transition-transform, scale-105
- Card hover: transition-shadow
- Toast entry: slide-in-top
- QR scan success: scale pulse once
- No continuous animations or distracting effects

## Images

**Hero Image:** None - this is a utility application focused on functionality
**QR Code Display:** Centered, white background, bordered, max-w-xs
**Empty States:** Use simple icon illustrations (Heroicons) with text, not images
**Scanner Preview:** Live camera feed, no static images needed