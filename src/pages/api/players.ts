import type { APIRoute } from 'astro';
import { createClientServer } from '@/lib/supabaseClient';

export const GET: APIRoute = async ({ cookies, url }) => {
  try {
    const supabase = createClientServer(cookies);
    
    // Get query parameters
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search');
    const position = url.searchParams.get('position');
    const sort = url.searchParams.get('sort') || 'rank';
    
    const offset = (page - 1) * limit;
    
    // Build query
    let query = supabase
      .from('player_performance_view')
      .select(`
        id,
        gamertag,
        position,
        player_rank_score,
        team_name,
        games_played
      `, { count: 'exact' });
    
    // Apply filters
    if (search) {
      query = query.ilike('gamertag', `%${search}%`);
    }
    
    if (position) {
      query = query.eq('position', position);
    }
    
    // Apply sorting
    switch (sort) {
      case 'rank':
        query = query.order('player_rank_score', { ascending: false });
        break;
      case 'games':
        query = query.order('games_played', { ascending: false });
        break;
      case 'name':
        query = query.order('gamertag', { ascending: true });
        break;
      default:
        query = query.order('player_rank_score', { ascending: false });
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1);
    
    const { data: players, error, count } = await query;
    
    if (error) {
      console.error('Error loading players:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to load players', 
        details: error 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      players: players || [], 
      totalCount: count || 0,
      page,
      limit
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('Error fetching players:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch players',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

