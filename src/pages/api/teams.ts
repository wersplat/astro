import type { APIRoute } from 'astro';
import { createClientServer } from '@/lib/supabaseClient';

const ITEMS_PER_PAGE = 25;

export const GET: APIRoute = async ({ request, cookies }) => {
  try {
    const supabase = createClientServer(cookies);
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'rp-desc';
    const page = parseInt(searchParams.get('page') || '1');
    const offset = (page - 1) * ITEMS_PER_PAGE;

    // Build query using team_performance_by_game_year
    let query = supabase
      .from('team_performance_by_game_year')
      .select(`
        team_id,
        team_name,
        current_ranking_points,
        game_year
      `, { count: 'exact' })
      .eq('game_year', '2K26');

    // Apply filters
    if (search) {
      query = query.ilike('team_name', `%${search}%`);
    }

    // Get active team IDs
    const { data: activeTeamIds } = await supabase
      .from('teams')
      .select('id')
      .eq('is_active', true);
    
    const activeTeamIdSet = new Set((activeTeamIds as { id: string }[] | null)?.map(t => t.id) || []);

    // Apply sorting
    switch (sort) {
      case 'rank-asc':
      case 'rp-desc':
        query = query.order('current_ranking_points', { ascending: false });
        break;
      case 'rank-desc':
      case 'rp-asc':
        query = query.order('current_ranking_points', { ascending: true });
        break;
      case 'name-asc':
        query = query.order('team_name', { ascending: true });
        break;
      case 'name-desc':
        query = query.order('team_name', { ascending: false });
        break;
    }

    // Add pagination
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

    type PerfRow = {
      team_id: string | null;
      team_name: string | null;
      current_ranking_points: number | null;
      game_year: string | null;
    };
    
    let { data: teamPerformanceData, count } = await query as unknown as { data: PerfRow[] | null; count: number | null };
    
    // Filter performance data to only include active teams
    if (teamPerformanceData) {
      teamPerformanceData = teamPerformanceData.filter(row => 
        row.team_id && activeTeamIdSet.has(row.team_id)
      );
      count = teamPerformanceData.length;
    }
    
    // Fallback: if performance view is empty, list from teams table
    let fallbackTeams: Array<{ id: string; name: string | null; logo_url: string | null }> = [];
    if (!teamPerformanceData || teamPerformanceData.length === 0) {
      let teamsQuery = supabase
        .from('teams')
        .select('id, name, logo_url', { count: 'exact' })
        .eq('is_active', true);

      if (search) {
        teamsQuery = teamsQuery.ilike('name', `%${search}%`);
      }

      // Name-based sorting when performance data is unavailable
      switch (sort) {
        case 'name-asc':
        case 'rank-asc':
        case 'rp-desc':
          teamsQuery = teamsQuery.order('name', { ascending: true });
          break;
        case 'name-desc':
        case 'rank-desc':
        case 'rp-asc':
          teamsQuery = teamsQuery.order('name', { ascending: false });
          break;
      }

      teamsQuery = teamsQuery.range(offset, offset + ITEMS_PER_PAGE - 1);

      const { data, count: fallbackCount } = await teamsQuery;
      fallbackTeams = data || [];
      count = fallbackCount ?? 0;

      // For the page's subset, try to enrich with RP from performance view
      const fbIds = fallbackTeams.map((t) => t.id);
      let perfMap = new Map<string, { team_id: string; current_ranking_points: number | null }>();
      if (fbIds.length > 0) {
        const { data: perfRows } = await supabase
          .from('team_performance_by_game_year')
          .select('team_id, current_ranking_points')
          .eq('game_year', '2K26')
          .in('team_id', fbIds);
        perfMap = new Map((perfRows || []).map((r: any) => [r.team_id, r]));
      }

      // Build synthetic performance list
      teamPerformanceData = fallbackTeams.map((t) => ({
        team_id: t.id,
        team_name: t.name,
        current_ranking_points: perfMap.get(t.id)?.current_ranking_points ?? 0,
        game_year: '2K26'
      }));
    }

    // Get additional team info (logos, colors) for the teams we have
    const teamIds = Array.from(new Set(teamPerformanceData?.map((t: any) => t.team_id).filter(Boolean) || []));
    const { data: teamDetails } = teamIds.length > 0 ? await supabase
      .from('teams')
      .select('id, name, logo_url')
      .in('id', teamIds) : { data: [] };
    
    const teamDetailsMap = new Map((teamDetails || []).map((t: any) => [t.id, t]));
    
    // Get player counts for each team
    const { data: playerCounts } = teamIds.length > 0 ? await supabase
      .from('team_rosters')
      .select('team_id')
      .in('team_id', teamIds)
      .is('left_at', null)
      .eq('game_year', '2K26') : { data: [] };
    
    const playerCountMap = new Map();
    (playerCounts || []).forEach((p: any) => {
      playerCountMap.set(p.team_id, (playerCountMap.get(p.team_id) || 0) + 1);
    });
    
    // Combine performance data with team details
    const teams = teamPerformanceData?.map((perf: any, index) => {
      const details = teamDetailsMap.get(perf.team_id);
      return {
        id: perf.team_id,
        name: (details as any)?.name || perf.team_name,
        logo_url: (details as any)?.logo_url,
        team_color: undefined,
        global_rank: index + 1,
        current_rp: perf.current_ranking_points,
        playerCount: playerCountMap.get(perf.team_id) || 0
      };
    }) || [];

    return new Response(JSON.stringify({
      teams,
      totalCount: count || 0,
      currentPage: page,
      hasMore: teams.length === ITEMS_PER_PAGE
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching teams:', error);
    return new Response(JSON.stringify(
      { error: 'Failed to fetch teams' }
    ), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
