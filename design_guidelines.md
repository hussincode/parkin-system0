# Smart Parking System - Enhanced Authentication Design Guidelines

## Design Approach

**Selected Approach:** Material Design with Security-Focused Elements
**Justification:** Building on the existing Material Design foundation, we add trust-building elements for authentication flows. The dual authentication system (Replit Auth + admin credentials) requires clear visual distinction between role types and security levels.

## Typography System

**Font Family:** Inter (Google Fonts CDN)
- **Page Titles:** text-3xl md:text-4xl, font-bold, tracking-tight
- **Section Headers:** text-xl md:text-2xl, font-semibold
- **Form Labels:** text-sm, font-medium, mb-2
- **Body Text:** text-base, font-normal, leading-relaxed
- **Helper/Error Text:** text-xs md:text-sm, font-normal
- **Role Badges:** text-xs, font-semibold, uppercase, tracking-wide

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, 8
- Card padding: p-6 md:p-8
- Form field spacing: gap-4 md:gap-6
- Section margins: mb-6 md:mb-8
- Button groups: gap-2 md:gap-4

## Core Components for Authentication

### 1. Landing Page (Unauthenticated)
- **Hero Section:** Full viewport (min-h-screen), centered content
- **Layout:** Single column, max-w-md centered with mx-auto
- **Hero Image:** Abstract parking lot illustration or modern building entrance (aspect-video, rounded-xl, mb-8)
- **Primary CTA:** Large "Get Started" button (h-14, w-full, rounded-lg, text-lg, font-semibold)
- **Secondary Actions:** "Admin Login" link (text-sm, underline, mt-4)
- **Trust Indicators:** Small feature icons with text below hero (grid-cols-3, gap-4, text-xs, text-center)

### 2. Role Selection Page (New Users After Replit Auth)
- **Layout:** Centered card (max-w-2xl, p-8, rounded-xl, shadow-lg)
- **Header:** "Choose Your Account Type" (text-2xl, font-bold, mb-6)
- **Role Cards:** Two equal-width cards in grid-cols-1 md:grid-cols-2, gap-6
  - Each card: p-6, rounded-lg, border-2, cursor-pointer
  - Icon at top: size-16, mb-4
  - Title: text-xl, font-semibold, mb-2
  - Description: text-sm, mb-4, leading-relaxed
  - Hover state: scale-102, shadow-md
  - Selected state: border-4, with checkmark icon in corner
- **Admin Card Elements:**
  - Shield icon (Heroicons: ShieldCheckIcon)
  - Title: "Administrator"
  - Features list: "Register vehicles", "View all visits", "Export reports" (text-xs, with check icons)
  - Badge: "Requires credentials" (text-xs, px-2, py-1, rounded-full)
- **Customer Card Elements:**
  - User icon (Heroicons: UserIcon)
  - Title: "Customer"
  - Features: "Scan QR codes", "Quick check-in/out" (text-xs, with check icons)
- **Continue Button:** Fixed at bottom or below cards (h-12, w-full md:w-auto, min-w-[200px])

### 3. Admin Credential Setup (After Selecting Admin Role)
- **Layout:** Stepped form with progress indicator at top
- **Progress Bar:** 3 steps - "Role Selection" → "Create Credentials" → "Complete"
  - Horizontal stepper with circles and connecting lines
  - Active step: filled circle with number
  - Completed steps: check icon in circle
  - Inactive: empty circle
- **Form Card:** max-w-md, p-6 md:p-8, rounded-xl
- **Header:** "Set Up Admin Credentials" (text-xl, font-bold, mb-6)
- **Fields:**
  - Username input: h-12, rounded-lg, px-4, with icon prefix (UserIcon, size-5)
  - Password input: h-12, rounded-lg, px-4, with eye toggle for visibility
  - Confirm password: same styling
  - Password strength meter: progress bar below password field (h-2, rounded-full, mb-2)
  - Requirements checklist: text-xs, with icons (8+ chars, 1 number, 1 special char)
- **Security Note:** Small alert card above form (rounded-md, p-4, border-l-4, text-sm) explaining admin access privileges
- **Submit Button:** h-12, w-full, rounded-lg, font-semibold

### 4. Admin Login Page
- **Layout:** Centered card (max-w-md, p-6 md:p-8, rounded-xl, shadow-lg)
- **Logo/Title Area:** mb-8, text-center
- **Form:**
  - Username field: h-12, rounded-lg, mb-4
  - Password field: h-12, rounded-lg, mb-6
  - Remember me checkbox: text-sm, mb-4
  - Login button: h-12, w-full, rounded-lg, font-semibold
- **Divider:** "or" text with horizontal lines (mt-6, mb-6)
- **Alternative Login:** "Continue with Replit Auth" button (h-12, w-full, rounded-lg, variant secondary)
- **Admin Badge:** Small badge in top-right of card (px-3, py-1, rounded-full, text-xs, font-semibold)

### 5. Role Badge Component (Throughout App)
- **Admin Badge:** px-3, py-1, rounded-full, text-xs, font-bold, uppercase
  - Position: top-right of navbar or next to username
  - Icon: ShieldCheckIcon (size-4, inline)
- **Customer Badge:** Similar styling with UserIcon
- **Display Location:** Header/navbar, profile dropdown, settings page

### 6. Enhanced Dashboard (Post-Login)
- **Admin Dashboard:**
  - Welcome header with role badge (text-2xl, font-bold, mb-2)
  - Username display below (text-sm, mb-8)
  - Navigation cards: grid-cols-1 md:grid-cols-3, gap-6
  - Each card: h-32, p-6, rounded-xl, shadow-md, hover:shadow-lg
  - Cards: "Register Vehicle", "View Visits", "Scanner Access"
  - Admin-only indicator on restricted cards (small lock icon)
- **Customer Dashboard:**
  - Simplified welcome (text-2xl, font-bold, mb-8)
  - Single large card for scanner access (h-48, centered content)
  - Quick stats if available (recent scans count, text-sm, mt-4)

### 7. Forms & Input Fields
- **Input Height:** h-12, consistent across all forms
- **Border Radius:** rounded-lg for inputs, rounded-md for small elements
- **Icons:** Left-aligned inside inputs (pl-12), size-5, positioned absolute
- **Focus States:** ring-2, ring-offset-2
- **Error States:** border-2 with error text below (text-xs, mt-1)
- **Required Fields:** Red asterisk in label

## Security Visual Indicators

- **Admin Areas:** Subtle shield icon watermark or badge in corner
- **Secure Forms:** Lock icon near submit buttons
- **Password Fields:** Strength meter (green/yellow/red gradient)
- **Session Indicators:** Small dot showing login status in header (green = active)

## Responsive Behavior

**Mobile (default):**
- Single column layouts
- Full-width buttons and cards
- Role selection cards stack vertically
- Reduced padding (p-4 instead of p-6)

**Desktop (md: 768px+):**
- Two-column role selection
- Side-by-side form layouts where appropriate
- Larger padding and spacing
- Fixed width centered cards (max-w-md, max-w-2xl)

## Animations

**Minimal, purposeful motion:**
- Role card selection: smooth border color transition (200ms)
- Button hover: scale-105 transform (150ms)
- Form validation: shake animation on error (300ms)
- Progress stepper: fade-in for completed steps
- NO continuous animations

## Images

**Landing Page Hero:** Modern parking facility entrance or abstract geometric parking lot design (aspect-video or aspect-[16/10], rounded-xl, object-cover, max-w-md)

**Position:** Above main CTA, centered, mb-8

**No other images required** - Use icons (Heroicons) for features, roles, and navigation