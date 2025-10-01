import type { APIRoute } from 'astro';
import { createClientServer } from '@/lib/supabaseClient';

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const supabase = createClientServer(cookies);
    
    console.log('Fetching tournaments...');
    
    // Get tournaments from tournaments table
    let { data: tournaments, error } = await supabase
      .from('tournaments')
      .select(`
        id,
        name,
        start_date,
        end_date,
        status,
        tier,
        organizer_id,
        prize_pool,
        description,
        max_rp,
        place
      `)
      .eq('game_year', '2K26')
      .order('start_date', { ascending: false });

    // If no 2K26 tournaments found, try without game_year filter
    if (!tournaments || tournaments.length === 0) {
      console.log('No 2K26 tournaments found, trying all tournaments...');
      const { data: allTournaments, error: allTournamentsError } = await supabase
        .from('tournaments')
        .select(`
          id,
          name,
          start_date,
          end_date,
          status,
          tier,
          organizer_id,
          prize_pool,
          description,
          max_rp,
          place
        `)
        .order('start_date', { ascending: false })
        .limit(50);

      if (allTournamentsError) {
        console.error('Error loading all tournaments:', allTournamentsError);
        return new Response(JSON.stringify({ 
          error: 'Failed to load tournaments', 
          details: allTournamentsError 
        }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      tournaments = allTournaments;
      console.log('All tournaments loaded:', tournaments?.length || 0, 'tournaments found');
    }

    console.log('Tournaments query result:', { tournaments: tournaments?.length || 0, error });

    if (error) {
      console.error('Error loading tournaments:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to load tournaments', 
        details: error,
        message: error.message 
      }), { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format tournaments for display
    const formattedTournaments = (tournaments || []).map((tournament: any) => ({
      id: tournament.id,
      name: tournament.name,
      start_date: tournament.start_date,
      end_date: tournament.end_date,
      status: tournament.status || 'upcoming',
      tier: tournament.tier,
      location: tournament.place,
      max_rp: tournament.max_rp,
      prize_pool: tournament.prize_pool,
      description: tournament.description
    }));

    return new Response(JSON.stringify({ tournaments: formattedTournaments }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching tournaments:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch tournaments',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
