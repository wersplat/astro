# Cloudflare Pages Deployment Guide

This guide will help you deploy your Global Rankings Astro application to Cloudflare Pages.

## Prerequisites

- A Cloudflare account
- Your project repository connected to GitHub/GitLab
- Supabase project configured

## Deployment Steps

### 1. Connect Repository to Cloudflare Pages

1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project"
3. Connect your Git repository (GitHub/GitLab)
4. Select your repository: `Global_Rankings/astro`

### 2. Configure Build Settings

Set the following build settings in Cloudflare Pages:

- **Framework preset**: Astro
- **Build command**: `npm run build`
- **Build output directory**: `dist`
- **Root directory**: `/` (or leave empty if repository root)

### 3. Environment Variables

In the Cloudflare Pages dashboard, go to Settings > Environment variables and add:

#### Required Variables:
```
PUBLIC_SUPABASE_URL=your_supabase_project_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Optional Variables (if using these services):
```
CLOUDFLARE_R2_URL=your_r2_url
CLOUDFLARE_R2_ACCESS_KEY_ID=your_r2_access_key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_r2_secret_key
CLOUDFLARE_R2_PUBLIC_URL=your_r2_public_url
OPENAI_API_KEY=your_openai_api_key
```

### 4. Deployment Configuration

The project is configured with:
- **Adapter**: `@astrojs/cloudflare` for edge runtime compatibility
- **Output mode**: Server-side rendering (SSR)
- **Platform**: Cloudflare Workers/Pages

### 5. Custom Domain (Optional)

1. In Cloudflare Pages, go to your project
2. Click "Custom domains"
3. Add your domain and follow DNS setup instructions

## Local Development

To test the Cloudflare adapter locally:

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

## Build Process

The build process:
1. TypeScript type checking (`astro check`)
2. Astro build with Cloudflare adapter
3. Outputs to `dist/` directory
4. Compatible with Cloudflare Workers runtime

## Environment Variables in Development

Create a `.env` file in your project root:

```env
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Troubleshooting

### Common Issues:

1. **Build failures**: Check that all environment variables are set in Cloudflare Pages
2. **Runtime errors**: Ensure Supabase configuration is correct
3. **Static assets**: Verify that public files are in the `public/` directory

### Debug Builds:

1. Check build logs in Cloudflare Pages dashboard
2. Test locally with `npm run build && npm run preview`
3. Verify environment variables are properly set

## Performance Optimizations

Cloudflare Pages provides:
- Global CDN distribution
- Edge caching
- Automatic HTTPS
- DDoS protection
- Serverless functions at the edge

Your Astro app benefits from:
- Zero-JS by default for static content
- Selective hydration for interactive components
- Optimized bundle sizes
- Fast global delivery

## Monitoring

- View deployment logs in Cloudflare Pages dashboard
- Monitor performance with Cloudflare Analytics
- Set up alerts for deployment failures

## Support

- [Cloudflare Pages Documentation](https://developers.cloudflare.com/pages/)
- [Astro Cloudflare Integration](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Supabase with Cloudflare](https://supabase.com/docs/guides/integrations/cloudflare)
