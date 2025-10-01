# Quick Start Guide - Astro App

## Available Pages

### Main Pages
- **Home:** `/`
- **Players:** `/players` - Browse all players with filters
- **Teams:** `/teams` - Browse all teams with rankings
- **Leagues:** `/leagues` - All active leagues
- **Tournaments:** `/tournaments` - Tournament listings

### New Pages Added
- **Achievements:** `/achievements` - Achievement system and badges
- **Crews:** `/crews` - City crews from around the world
- **Events:** `/events` - Combined view of all tournaments and leagues
- **Pro-Am History:** `/pro-am-history` - Historical timeline
- **Ranking System:** `/ranking-system` - How rankings work
- **UPA College:** `/upa-college` - College league overview
- **Team Preview:** `/team-preview` - Team rankings preview
- **2K26 Overview:** `/2k26-overview` - Current season overview
- **2K26 Team Preview:** `/2k26-team-preview` - 2K26 team rankings
- **Submit Results:** `/submit-results` - Match result submission

### Dynamic Routes
- **Player Profile:** `/player/[id]` - Individual player pages
- **Team Profile:** `/team/[id]` - Individual team pages
- **Crew Profile:** `/crew/[id]` - Individual crew pages
- **League Details:** `/league/[id]` - Individual league pages
- **Tournament Details:** `/tournament/[id]` - Individual tournament pages

## Development

```bash
# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Copy `env.example` to `.env` and configure:
```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Navigation Structure

### Explore Menu
- Players
- Teams
- Crews
- Achievements
- History
- Ranking System

### Competition Menu
- Tournaments
- Leagues
- Events
- UPA College
- 2K26 Overview
- Team Preview

## Notes

- All React components use `client:load` for hydration
- Server data fetching happens in Astro page frontmatter
- MUI components are available in all React components
- Supabase client configured for both server and browser contexts

## Known Build Warnings

The build may show TypeScript warnings related to:
- MUI Grid component (v6 compatibility)
- Some unused imports
- Type annotations

These are cosmetic and don't affect runtime functionality.

