'use client';

type OverviewProps = {
  player: any;
  team: any;
};

export default function Overview({ player, team }: OverviewProps) {
  if (!player) return <div>Player not found</div>;

  return (
    <div>
      <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Player Overview</h2>
      
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
        {/* Basic Info */}
        <div class="paper" style="padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Basic Information</h3>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div style="display: flex; justify-content: space-between;">
              <span class="text-secondary">Gamertag:</span>
              <span style="font-weight: 600;">{player.gamertag}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="text-secondary">Position:</span>
              <span style="font-weight: 600;">{player.position || 'Unknown'}</span>
            </div>
            {player.salary_tier && (
              <div style="display: flex; justify-content: space-between;">
                <span class="text-secondary">Salary Tier:</span>
                <span style="font-weight: 600; color: #F59E08;">Tier {player.salary_tier}</span>
              </div>
            )}
            {player.is_rookie && (
              <div style="display: flex; justify-content: space-between;">
                <span class="text-secondary">Status:</span>
                <span style="font-weight: 600; color: #8B5CF6;">Rookie</span>
              </div>
            )}
          </div>
        </div>

        {/* Team Info */}
        {team && (
          <div class="paper" style="padding: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Current Team</h3>
            <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
              {team.logo_url && (
                <img 
                  src={team.logo_url} 
                  alt={team.name}
                  style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover;"
                />
              )}
              <div>
                <div style="font-weight: 600; font-size: 1.125rem; margin-bottom: 0.25rem;">
                  {team.name}
                </div>
                <div class="text-secondary" style="font-size: 0.875rem;">
                  Rank #{team.global_rank || 'N/A'} • {team.current_rp || 0} RP
                </div>
              </div>
            </div>
            <a 
              href={`/team/${team.id}`}
              style="color: var(--color-primary); text-decoration: none; font-size: 0.875rem;"
              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              View Team Details →
            </a>
          </div>
        )}

        {/* Stats Summary */}
        <div class="paper" style="padding: 1.5rem;">
          <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Key Stats</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            {player.player_rp !== null && (
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Ranking Points</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                  {player.player_rp}
                </div>
              </div>
            )}
            {player.performance_score !== null && player.performance_score > 0 && (
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Performance</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {Math.round(player.performance_score)}
                </div>
              </div>
            )}
            {player.player_rank_score !== null && player.player_rank_score > 0 && (
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Rank Score</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">
                  {Math.round(player.player_rank_score)}
                </div>
              </div>
            )}
            {player.monthly_value !== null && player.monthly_value > 0 && (
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Monthly Value</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  ${player.monthly_value.toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        {(player.twitch || player.twitter_id || player.discord_id) && (
          <div class="paper" style="padding: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Social Links</h3>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              {player.twitch && (
                <a 
                  href={`https://twitch.tv/${player.twitch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: #9146FF; text-decoration: none; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;"
                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  📺 Twitch: {player.twitch}
                </a>
              )}
              {player.twitter_id && (
                <a 
                  href={`https://twitter.com/${player.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style="color: #1DA1F2; text-decoration: none; font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;"
                  onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  🐦 Twitter: @{player.twitter_id}
                </a>
              )}
              {player.discord_id && (
                <span class="text-secondary" style="font-size: 0.875rem; display: flex; align-items: center; gap: 0.5rem;">
                  💬 Discord: {player.discord_id}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
