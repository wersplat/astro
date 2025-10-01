import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { 
  Twitter as TwitterIcon,
  YouTube as YouTubeIcon
} from '@mui/icons-material';

// Custom Discord Icon Component
const DiscordIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

// Custom Twitch Icon Component
const TwitchIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M11.571 4.714h1.715v5.143H11.57l-1.714-1.714V4.714zm7.715 0H20v5.143h-1.714l-1.714-1.714V4.714zm-9.143 6.857h1.714v6.857H9.143v-6.857zm7.714 0h1.714v6.857h-1.714v-6.857zM2.571 0L0 2.571v18.857h5.143V24l3.429-2.571h2.571L24 12V0H2.571zm20.571 11.143L18.857 16H16l-3.429 2.571V16H5.143V2.571h18v8.572z"/>
  </svg>
);

type TeamSocialsProps = {
  twitter_url?: string | null;
  discord_url?: string | null;
  youtube_url?: string | null;
  twitch_url?: string | null;
};

export default function TeamSocials({ 
  twitter_url, 
  discord_url, 
  youtube_url, 
  twitch_url 
}: TeamSocialsProps) {
  const socialLinks = [
    {
      url: twitter_url,
      icon: <TwitterIcon />,
      label: 'Twitter',
      color: '#1DA1F2'
    },
    {
      url: discord_url,
      icon: <DiscordIcon />,
      label: 'Discord',
      color: '#5865F2'
    },
    {
      url: youtube_url,
      icon: <YouTubeIcon />,
      label: 'YouTube',
      color: '#FF0000'
    },
    {
      url: twitch_url,
      icon: <TwitchIcon />,
      label: 'Twitch',
      color: '#9146FF'
    }
  ].filter(link => link.url);

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      {socialLinks.map((social) => (
        <Tooltip key={social.label} title={social.label} arrow>
          <IconButton
            component="a"
            href={social.url!}
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            sx={{
              color: social.color,
              '&:hover': {
                backgroundColor: `${social.color}15`,
                transform: 'scale(1.1)'
              },
              transition: 'all 0.2s ease-in-out'
            }}
            aria-label={`Visit ${social.label} page`}
          >
            {social.icon}
          </IconButton>
        </Tooltip>
      ))}
    </Stack>
  );
}
