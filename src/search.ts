import { supabase } from './lib/supabase';

// search box on the feed: title ilike '%q%' has no trigram index, so at 100k rows this is a full table scan
export async function searchPosts(q: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .ilike('title', `%${q}%`)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}
