# Finance Dashboard

A modern, responsive finance dashboard built with Next.js 13+ (App Router), TypeScript, Tailwind CSS, and PWA support.

## Features

- 🚀 **Next.js 13+ with App Router** - Latest Next.js features including server components
- 💎 **TypeScript** - Full type safety across the application
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- 📱 **Responsive Design** - Mobile-first approach with responsive navigation
- 🔄 **PWA Support** - Progressive Web App with offline capabilities
- 🌗 **Dark Mode** - Automatic dark mode support based on system preferences
- 📊 **Finance Dashboard UI** - Pre-built components for financial data visualization
- 🧩 **Component Library** - Reusable UI components (Card, Button, etc.)
- 🎯 **Layout System** - Responsive header, sidebar, and mobile navigation

## Tech Stack

- **Framework:** Next.js 13+
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **PWA:** @ducanh2912/next-pwa
- **Fonts:** Geist Sans & Geist Mono

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd /path/to/project
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The application will automatically reload when you make changes to the code.

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

## Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout with PWA metadata
│   ├── page.tsx             # Dashboard home page
│   ├── globals.css          # Global styles with design tokens
│   ├── trends/              # Trends page
│   ├── wallet/              # Wallet page
│   ├── analytics/           # Analytics page
│   └── settings/            # Settings page
├── components/              # React components
│   ├── layout/             # Layout components
│   │   ├── DashboardLayout.tsx  # Main dashboard layout wrapper
│   │   ├── Header.tsx           # Top navigation header
│   │   ├── Sidebar.tsx          # Desktop sidebar navigation
│   │   └── MobileNav.tsx        # Bottom mobile navigation
│   └── ui/                 # Reusable UI components
│       ├── Card.tsx        # Card component with variants
│       └── Button.tsx      # Button component with variants
├── public/                 # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── icon-192x192.svg   # PWA icon (192x192)
│   └── icon-512x512.svg   # PWA icon (512x512)
└── next.config.ts          # Next.js configuration with PWA
```

## Design System

### Color Tokens

The application uses a comprehensive design token system defined in `app/globals.css`:

- **Primary:** `#0f172a` - Main brand color (dark slate)
- **Secondary:** `#10b981` - Accent color (emerald green)
- **Accent:** `#3b82f6` - Highlight color (blue)
- **Success:** `#10b981` - Success states
- **Warning:** `#f59e0b` - Warning states
- **Danger:** `#ef4444` - Error/danger states
- **Info:** `#3b82f6` - Information states

### Typography

- **Headings:** h1 (2.5rem) down to h6 (1rem)
- **Font Family:** Geist Sans for body text, Geist Mono for code
- **Responsive:** Font sizes automatically adjust on mobile devices

### Layout Variables

- **Header Height:** 64px
- **Mobile Nav Height:** 64px
- **Sidebar Width:** 256px (desktop)

## PWA Configuration

The application is configured as a Progressive Web App with:

- **Manifest:** `/public/manifest.json`
- **Icons:** SVG icons for all sizes (192x192, 512x512)
- **Theme Color:** `#0f172a`
- **Display Mode:** Standalone
- **Offline Support:** Automatic caching with Workbox
- **Service Worker:** Auto-generated (disabled in development)

### PWA Features

- ✅ Installable on mobile and desktop
- ✅ Offline-first caching strategy
- ✅ App-like experience with standalone display
- ✅ Fast loading with aggressive caching
- ✅ Auto-reload when online after being offline

## Responsive Breakpoints

- **Mobile:** < 640px - Bottom navigation visible
- **Tablet:** 640px - 1024px - Responsive grid adjustments
- **Desktop:** > 1024px - Sidebar always visible, bottom nav hidden

## Navigation Structure

### Desktop (≥ 1024px)
- Fixed header at top
- Collapsible sidebar on left
- Main content area

### Mobile (< 1024px)
- Fixed header at top
- Hamburger menu opens sidebar overlay
- Fixed bottom navigation with 5 tabs
- Main content with appropriate padding

## Environment Variables

Currently, no environment variables are required for basic functionality. Add any API keys or configuration in `.env.local`:

```bash
# Example environment variables
# NEXT_PUBLIC_API_URL=https://api.example.com
# NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Testing PWA

To test PWA functionality:

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Open Chrome DevTools > Lighthouse
4. Run PWA audit to verify installability

The PWA service worker is disabled in development mode for better developer experience.

## Customization

### Adding New Pages

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Wrap content with `<DashboardLayout>`
4. Update navigation in `components/layout/Sidebar.tsx` and `MobileNav.tsx`

### Modifying Colors

Edit the CSS custom properties in `app/globals.css`:

```css
:root {
  --primary: #0f172a;
  --secondary: #10b981;
  /* Add or modify color tokens */
}
```

### Adding Components

Create new components in `components/ui/` following the existing patterns:

```typescript
// components/ui/YourComponent.tsx
export default function YourComponent() {
  return <div>Your Component</div>;
}
```

## Performance

- ⚡ Automatic code splitting
- 🖼️ Optimized image loading with Next.js Image
- 📦 Tree-shaking for minimal bundle size
- 🚀 Server-side rendering for fast initial load
- 💾 Aggressive caching for return visits

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly (including responsive design)
4. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.
