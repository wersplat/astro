# NBA 2K Pro-Am Global Rankings - Astro Version

This is an Astro migration of the Next.js app, providing the same functionality with improved performance and flexibility.

## 🚀 Features

- **Lightning Fast**: Astro's zero-JS by default approach ensures minimal bundle sizes
- **Islands Architecture**: Interactive components are hydrated only where needed
- **Material-UI Integration**: Full Material-UI support with React islands
- **TypeScript**: Fully typed for better developer experience
- **Supabase Integration**: Real-time data from the same Supabase backend

## 📁 Project Structure

```
src/
├── pages/                 # Astro pages (.astro files)
│   ├── api/              # API endpoints (TypeScript)
│   ├── index.astro       # Home page
│   ├── players.astro     # Players listing
│   ├── teams.astro       # Teams listing
│   └── leagues.astro     # Leagues listing
├── components/           # React components
│   ├── home/            # Home page components
│   ├── players/         # Player-related components
│   ├── teams/           # Team-related components
│   ├── leagues/         # League-related components
│   └── layout/          # Layout components
├── layouts/             # Astro layouts
│   └── Layout.astro     # Main layout
├── lib/                 # Utilities and helpers
│   ├── supabaseClient.ts
│   └── teams.ts
├── types/               # TypeScript type definitions
│   ├── database.types.ts
│   └── achievements.ts
├── theme/               # Material-UI theme configuration
│   └── ThemeProvider.tsx
└── data/                # Static data files
    └── achievements.ts
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔄 Migration Notes

### Key Differences from Next.js Version

1. **Pages**: Converted from `.tsx` to `.astro` files
2. **API Routes**: Converted to Astro API endpoints with different export syntax
3. **Client Hydration**: Using `client:load` directive for interactive components
4. **Environment Variables**: Using `PUBLIC_` prefix instead of `NEXT_PUBLIC_`
5. **Routing**: File-based routing similar to Next.js but with `.astro` extensions

### Components Requiring Client-Side Hydration

- Navigation dropdowns and mobile menu
- Filter forms and search functionality
- Data tables with sorting and pagination
- Modal dialogs and interactive elements

### Server-Side Features

- Static page generation for better performance
- Server-side data fetching in page components
- SEO-friendly routing and metadata

## 🌐 Environment Variables

Create a `.env` file with the following variables:

```bash
# Supabase Configuration
PUBLIC_SUPABASE_URL=your_supabase_url_here
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudflare R2 Configuration (for file uploads)
CLOUDFLARE_R2_URL=your_r2_bucket_url_here
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key_here
CLOUDFLARE_R2_PUBLIC_URL=your_r2_public_url_here

# OpenAI Configuration (for OCR)
OPENAI_API_KEY=your_openai_api_key_here
```

## 📊 Performance Benefits

- **Reduced JavaScript Bundle**: Only interactive components are hydrated
- **Faster Page Loads**: Static generation where possible
- **Better SEO**: Server-side rendering for all content
- **Improved Core Web Vitals**: Minimal JavaScript execution

## 🔗 Deployment

The Astro version can be deployed to:
- Vercel
- Netlify 
- Railway
- Any Node.js hosting provider

For static sites, use:
```bash
npm run build
```

For server-side rendering, ensure your deployment platform supports Node.js.

## 🚨 Known Limitations

1. Some complex interactive features may need additional client-side hydration
2. Real-time subscriptions need careful handling with Astro's islands
3. File upload functionality requires server-side API endpoint configuration

## 📈 Migration Status

- ✅ Basic project setup and configuration
- ✅ Core pages (home, players, teams, leagues)
- ✅ Material-UI theme integration
- ✅ Essential API endpoints
- ✅ TypeScript types and utilities
- 🔄 Component migration (in progress)
- ⏳ Advanced features and interactive components
- ⏳ Testing and optimization