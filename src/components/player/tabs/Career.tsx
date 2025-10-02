'use client';

import { useState, useEffect } from 'react';

type CareerProps = {
  player: any;
  playerId: string;
};

type CareerStats = {
  totalGames: number;
  totalPoints: number;
  totalAssists: number;
  totalRebounds: number;
  totalSteals: number;
  totalBlocks: number;
  totalTurnovers: number;
  avgPoints: number;
  avgAssists: number;
  avgRebounds: number;
  avgSteals: number;
  avgBlocks: number;
  avgTurnovers: number;
  careerHighPoints: number;
  careerHighAssists: number;
  careerHighRebounds: number;
  careerHighSteals: number;
  careerHighBlocks: number;
};

export default function Career({ player, playerId }: CareerProps) {
  const [careerStats, setCareerStats] = useState<CareerStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCareerStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // This would typically be an API call to get all career stats
        // For now, we'll simulate with the data we have
        const response = await fetch(`/api/player-stats?player_id=${playerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch career stats');
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          const stats = data.reduce((acc: any, game: any) => {
            acc.totalGames += 1;
            acc.totalPoints += game.points || 0;
            acc.totalAssists += game.assists || 0;
            acc.totalRebounds += game.rebounds || 0;
            acc.totalSteals += game.steals || 0;
            acc.totalBlocks += game.blocks || 0;
            acc.totalTurnovers += game.turnovers || 0;
            
            acc.careerHighPoints = Math.max(acc.careerHighPoints, game.points || 0);
            acc.careerHighAssists = Math.max(acc.careerHighAssists, game.assists || 0);
            acc.careerHighRebounds = Math.max(acc.careerHighRebounds, game.rebounds || 0);
            acc.careerHighSteals = Math.max(acc.careerHighSteals, game.steals || 0);
            acc.careerHighBlocks = Math.max(acc.careerHighBlocks, game.blocks || 0);
            
            return acc;
          }, {
            totalGames: 0,
            totalPoints: 0,
            totalAssists: 0,
            totalRebounds: 0,
            totalSteals: 0,
            totalBlocks: 0,
            totalTurnovers: 0,
            avgPoints: 0,
            avgAssists: 0,
            avgRebounds: 0,
            avgSteals: 0,
            avgBlocks: 0,
            avgTurnovers: 0,
            careerHighPoints: 0,
            careerHighAssists: 0,
            careerHighRebounds: 0,
            careerHighSteals: 0,
            careerHighBlocks: 0
          });

          // Calculate averages
          if (stats.totalGames > 0) {
            stats.avgPoints = stats.totalPoints / stats.totalGames;
            stats.avgAssists = stats.totalAssists / stats.totalGames;
            stats.avgRebounds = stats.totalRebounds / stats.totalGames;
            stats.avgSteals = stats.totalSteals / stats.totalGames;
            stats.avgBlocks = stats.totalBlocks / stats.totalGames;
            stats.avgTurnovers = stats.totalTurnovers / stats.totalGames;
          }

          setCareerStats(stats);
        } else {
          setCareerStats({
            totalGames: 0,
            totalPoints: 0,
            totalAssists: 0,
            totalRebounds: 0,
            totalSteals: 0,
            totalBlocks: 0,
            totalTurnovers: 0,
            avgPoints: 0,
            avgAssists: 0,
            avgRebounds: 0,
            avgSteals: 0,
            avgBlocks: 0,
            avgTurnovers: 0,
            careerHighPoints: 0,
            careerHighAssists: 0,
            careerHighRebounds: 0,
            careerHighSteals: 0,
            careerHighBlocks: 0
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load career stats');
      } finally {
        setLoading(false);
      }
    };

    if (playerId) {
      fetchCareerStats();
    }
  }, [playerId]);

  if (!player) return <div>Player not found</div>;

  if (loading) {
    return (
      <div>
        <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Career Statistics</h2>
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary">Loading career statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Career Statistics</h2>
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p style="color: #ef4444;">Error loading career statistics: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style="margin-bottom: 1.5rem; color: var(--color-text);">Career Statistics</h2>
      
      {careerStats && careerStats.totalGames > 0 ? (
        <div style="display: grid; gap: 2rem;">
          {/* Career Totals */}
          <div class="paper" style="padding: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Career Totals</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem;">
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Games Played</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">
                  {careerStats.totalGames}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Total Points</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">
                  {careerStats.totalPoints.toLocaleString()}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Total Assists</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">
                  {careerStats.totalAssists.toLocaleString()}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Total Rebounds</div>
                <div style="font-size: 2rem; font-weight: 700; color: var(--color-primary);">
                  {careerStats.totalRebounds.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Career Averages */}
          <div class="paper" style="padding: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Career Averages</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Points</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {careerStats.avgPoints.toFixed(1)}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Assists</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {careerStats.avgAssists.toFixed(1)}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Rebounds</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {careerStats.avgRebounds.toFixed(1)}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Steals</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {careerStats.avgSteals.toFixed(1)}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Blocks</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {careerStats.avgBlocks.toFixed(1)}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Turnovers</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #9BF00B;">
                  {careerStats.avgTurnovers.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Career Highs */}
          <div class="paper" style="padding: 1.5rem;">
            <h3 style="margin: 0 0 1rem 0; color: var(--color-text);">Career Highs</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Points</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #8B5CF6;">
                  {careerStats.careerHighPoints}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Assists</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #8B5CF6;">
                  {careerStats.careerHighAssists}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Rebounds</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #8B5CF6;">
                  {careerStats.careerHighRebounds}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Steals</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #8B5CF6;">
                  {careerStats.careerHighSteals}
                </div>
              </div>
              <div style="text-align: center;">
                <div class="text-secondary" style="font-size: 0.875rem; margin-bottom: 0.25rem;">Blocks</div>
                <div style="font-size: 1.5rem; font-weight: 700; color: #8B5CF6;">
                  {careerStats.careerHighBlocks}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="paper" style="padding: 2rem; text-align: center;">
          <p class="text-secondary" style="margin: 0; font-size: 1.125rem;">
            No career statistics available
          </p>
        </div>
      )}
    </div>
  );
}
