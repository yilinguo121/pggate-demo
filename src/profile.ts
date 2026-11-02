import { supabase } from './lib/supabase';

// 乾淨：username 是 unique，走索引
export async function loadProfile(username: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, bio, avatar_url')
    .eq('username', username)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// 壞味道 1 的觸發 query（缺 FK index）：posts.author_id 沒有索引，scale 下這條會 Seq Scan
export async function loadAuthorPosts(authorId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, created_at')
    .eq('author_id', authorId)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) throw error;
  return data;
}

// 壞味道 5（exact count）：追蹤者數用 count: 'exact'，scale 下 follows 超過 10 萬列
export async function countFollowers(profileId: string) {
  const { count, error } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('followee_id', profileId);
  if (error) throw error;
  return count ?? 0;
}

// 乾淨：我追蹤的人，有 limit
export async function loadFollowing(profileId: string) {
  const { data, error } = await supabase
    .from('follows')
    .select('followee_id, profiles!follows_followee_id_fkey(username, avatar_url)')
    .eq('follower_id', profileId)
    .limit(50);
  if (error) throw error;
  return data;
}
