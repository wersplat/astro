'use client';

import { useState, useEffect } from 'react';

type MediaProps = {
  player: any;
  playerId: string;
};

type MediaItem = {
  id: string;
  title: string;
  description: string;
  type: 'youtube' | 'twitch' | 'twitter' | 'instagram' | 'tiktok' | 'other';
  url: string;
  thumbnailUrl?: string;
  publishedAt: string;
  duration?: string;
  views?: number;
  likes?: number;
};

export default function Media({ player, playerId }: MediaProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'youtube' | 'twitch' | 'twitter' | 'instagram'>('all');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        setError(null);

        // This would typically be an API call to get player media
        // For now, we'll use mock data
        const mockMedia: MediaItem[] = [
          {
            id: '1',
            title: 'Epic Triple Double Game',
            description: 'My best game of the season with 25 points, 12 assists, and 10 rebounds',
            type: 'youtube',
            url: 'https://youtube.com/watch?v=example1',
            thumbnailUrl: 'https://img.youtube.com/vi/example1/maxresdefault.jpg',
            publishedAt: '2024-01-15',
            duration: '12:34',
            views: 1250,
            likes: 89
          },
          {
            id: '2',
            title: 'Live Stream - Pro-Am Practice',
            description: 'Practicing with the team before the big tournament',
            type: 'twitch',
            url: 'https://twitch.tv/videos/example2',
            thumbnailUrl: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_example-320x180.jpg',
            publishedAt: '2024-01-20',
            duration: '2:15:30',
            views: 450,
            likes: 23
          },
          {
            id: '3',
            title: 'Game-winning shot! 🏀',
            description: 'Clutch 3-pointer to win the championship game',
            type: 'twitter',
            url: 'https://twitter.com/status/example3',
            thumbnailUrl: 'https://pbs.twimg.com/media/example3.jpg',
            publishedAt: '2024-01-25',
            views: 2100,
            likes: 156
          },
          {
            id: '4',
            title: 'Behind the Scenes: Team Practice',
            description: 'Getting ready for the upcoming season',
            type: 'instagram',
            url: 'https://instagram.com/p/example4',
            thumbnailUrl: 'https://scontent.cdninstagram.com/example4.jpg',
            publishedAt: '2024-02-01',
            views: 890,
            likes: 67
          },
          {
            id: '5',
            title: 'TikTok: Crazy Crossover',
            description: 'My signature move that always works',
            type: 'tiktok',
            url: 'https://tiktok.com/@user/video/example5',
            thumbnailUrl: 'https://p16-sign.tiktokcdn-us.com/example5.jpg',
            publishedAt: '2024-02-05',
            views: 5600,
            likes: 445
          }
        ];

        setMediaItems(mockMedia);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load media');
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchMedia();
    }
  }, [playerId]);

  if (!player) return <div>Player not found</div>;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'youtube': return '📺';
      case 'twitch': return '🎮';
      case 'twitter': return '🐦';
      case 'instagram': return '📷';
      case 'tiktok': return '🎵';
      default: return '🔗';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'youtube': return '#FF0000';
      case 'twitch': return '#9146FF';
      case 'twitter': return '#1DA1F2';
      case 'instagram': return '#E4405F';
      case 'tiktok': return '#000000';
      default: return '#6B7280';
    }
  };

  const filteredMedia = mediaItems.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDuration = (duration: string) => {
    const parts = duration.split(':');
    if (parts.length === 2) {
      return `${parts[0]}:${parts[1]}`;
    } else if (parts.length === 3) {
      const hours = parseInt(parts[0]);
      const minutes = parseInt(parts[1]);
      const seconds = parseInt(parts[2]);
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      } else {
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    }
    return duration;
  };

  if (loading) {
    return (
      <div>
        <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Media & Highlights</h2>
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary">Loading media...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Media & Highlights</h2>
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p style="color: #ef4444;">Error loading media: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
        <h2 style="margin: 0; color: var(--color-text);">Media & Highlights</h2>
        <div style="display: flex; gap: 0.5rem;">
          <button
            onClick={() => setFilter('all')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'all' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'all' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('youtube')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'youtube' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'youtube' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            YouTube
          </button>
          <button
            onClick={() => setFilter('twitch')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'twitch' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'twitch' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Twitch
          </button>
          <button
            onClick={() => setFilter('twitter')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'twitter' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'twitter' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Twitter
          </button>
          <button
            onClick={() => setFilter('instagram')}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              background: filter === 'instagram' ? 'var(--color-primary)' : 'transparent',
              color: filter === 'instagram' ? 'white' : 'var(--color-text)',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Instagram
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem;">
        {filteredMedia.map((item) => (
          <div 
            key={item.id}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: '12px',
              overflow: 'hidden',
              background: 'var(--color-surface)',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={() => window.open(item.url, '_blank')}
          >
            {/* Thumbnail */}
            <div style={{ position: 'relative', aspectRatio: '16/9', background: 'var(--color-background)' }}>
              {item.thumbnailUrl ? (
                <img 
                  src={item.thumbnailUrl} 
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                  color: 'var(--color-text-secondary)'
                }}>
                  {getTypeIcon(item.type)}
                </div>
              )}
              
              {/* Duration overlay */}
              {item.duration && (
                <div style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '8px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {formatDuration(item.duration)}
                </div>
              )}

              {/* Type indicator */}
              <div style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                background: getTypeColor(item.type),
                color: 'white',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <span>{getTypeIcon(item.type)}</span>
                <span style={{ textTransform: 'capitalize' }}>{item.type}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1rem' }}>
              <h4 style={{
                margin: '0 0 0.5rem 0',
                color: 'var(--color-text)',
                fontSize: '1rem',
                fontWeight: '600',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.title}
              </h4>

              <p style={{
                margin: '0 0 1rem 0',
                color: 'var(--color-text-secondary)',
                fontSize: '0.875rem',
                lineHeight: '1.4',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.description}
              </p>

              {/* Stats */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: 'var(--color-text-secondary)'
              }}>
                <span>{formatDate(item.publishedAt)}</span>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {item.views && (
                    <span>👁️ {item.views.toLocaleString()}</span>
                  )}
                  {item.likes && (
                    <span>❤️ {item.likes.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary" style="margin: 0; font-size: 1.125rem;">
            No media found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
}
