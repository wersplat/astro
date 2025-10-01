import type { APIRoute } from 'astro';
import { createClientServer } from '@/lib/supabaseClient';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createClientServer(cookies);
    
    // Get league seasons from league_seasons table
    let { data: leagueSeasons, error: seasonsError } = await supabase
      .from('league_seasons')
      .select(`
        id,
        league_id,
        season_number,
        start_date,
        end_date,
        is_active,
        year
      `)
      .eq('year', '2K26')
      .order('start_date', { ascending: false });

    // If no 2K26 seasons found, try without game_year filter
    if (!leagueSeasons || leagueSeasons.length === 0) {
      console.log('No 2K26 seasons found, trying all seasons...');
      const { data: allSeasons, error: allSeasonsError } = await supabase
        .from('league_seasons')
        .select(`
          id,
          league_id,
          season_number,
          start_date,
          end_date,
          is_active,
          year
        `)
        .order('start_date', { ascending: false });
      
      if (allSeasonsError) {
        console.error('Error loading all seasons:', allSeasonsError);
        return new Response(JSON.stringify({ error: 'Failed to load leagues' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      leagueSeasons = allSeasons;
      console.log('All seasons loaded:', leagueSeasons?.length || 0, 'seasons found');
    }

    if (seasonsError) {
      console.error('Error loading league seasons:', seasonsError);
      return new Response(JSON.stringify({ error: 'Failed to load leagues' }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('League seasons loaded:', leagueSeasons?.length || 0, 'seasons found');

    // Get league info data for all unique league_ids
    const uniqueLeagueIds = [...new Set((leagueSeasons || []).map((season: any) => season.league_id).filter(Boolean))];
    console.log('Unique league IDs found:', uniqueLeagueIds);
    
    const { data: leagueInfoData, error: leagueInfoError } = uniqueLeagueIds.length > 0 ? await supabase
      .from('leagues_info')
      .select('id, league, lg_logo_url, lg_url, lg_discord, twitch_url, twitter_id')
      .in('id', uniqueLeagueIds) : { data: [] };

    if (leagueInfoError) {
      console.error('Error loading league info:', leagueInfoError);
    }

    console.log('League info data loaded:', leagueInfoData?.length || 0, 'leagues found');

    // Create a map of league info by league_id
    const leagueInfoMap = new Map<string, any>();
    (leagueInfoData || []).forEach((info: any) => {
      leagueInfoMap.set(info.id, info);
    });

    // Group by league_id to get unique leagues
    const leaguesByLeagueId = new Map<string, any>();
    (leagueSeasons || []).forEach((season: any) => {
      const leagueId = season.league_id;
      if (!leagueId) return;
      
      const leagueInfo = leagueInfoMap.get(leagueId);
      
      if (!leaguesByLeagueId.has(leagueId)) {
        leaguesByLeagueId.set(leagueId, {
          id: leagueId,
          name: leagueInfo?.league || 'League',
          logo: leagueInfo?.lg_logo_url,
          website: leagueInfo?.lg_url || '#',
          discord: leagueInfo?.lg_discord,
          twitch: leagueInfo?.twitch_url,
          twitter: leagueInfo?.twitter_id,
          latestSeason: season,
          allSeasons: [season],
          gameYear: season.year
        });
      } else {
        // Add to allSeasons if this is a different season
        const existing = leaguesByLeagueId.get(leagueId);
        existing.allSeasons.push(season);
        // Update latest season if this one is more recent
        if (new Date(season.start_date) > new Date(existing.latestSeason.start_date)) {
          existing.latestSeason = season;
        }
      }
    });

    // Convert to array and format for dropdown
    const leagues = Array.from(leaguesByLeagueId.values()).map(league => {
      const latestSeason = league.latestSeason;
      
      // Determine status based on dates and active flag
      let status = 'Upcoming';
      if (latestSeason?.is_active) {
        status = 'Active';
      } else if (latestSeason?.end_date && new Date(latestSeason.end_date) < new Date()) {
        status = 'Completed';
      } else if (latestSeason?.start_date && new Date(latestSeason.start_date) > new Date()) {
        status = 'Upcoming';
      }

      // Get all seasons for this league
      const seasons = league.allSeasons.map((season: any) => ({
        id: season.id,
        season_number: season.season_number,
        start_date: season.start_date,
        end_date: season.end_date,
        is_active: season.is_active,
        status: season.is_active ? 'Active' : 
                (season.end_date && new Date(season.end_date) < new Date()) ? 'Completed' : 'Upcoming'
      }));

      return {
        id: league.id,
        name: league.name,
        logo: league.logo,
        status,
        start_date: latestSeason?.start_date || null,
        end_date: latestSeason?.end_date || null,
        season_number: latestSeason?.season_number || null,
        game_year: league.gameYear || null,
        totalSeasons: league.allSeasons.length,
        seasons: seasons
      };
    });

    console.log('Final leagues array:', leagues.length, 'leagues to return');

    return new Response(JSON.stringify({ leagues }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching leagues:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch leagues',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
