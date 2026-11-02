import { supabase } from './lib/supabase';

// admin stats page: every comment, no limit — a new finding on top of the five that are already on main
export async function allComments() {
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
