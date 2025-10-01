import SimpleNavigation from './SimpleNavigation';

// Simplified AppNavigation - just uses SimpleNavigation for now
export default function AppNavigation({ pathname }: { pathname: string }) {
  return <SimpleNavigation pathname={pathname} />;
}
