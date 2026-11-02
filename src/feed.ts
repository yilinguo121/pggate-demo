import { supabase } from './lib/supabase';

export async function loadFeed() {
  // 壞味道 4（無 limit 列表）：首頁 feed 沒有 limit / range
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, title, body, author_id, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;

  // 壞味道 3（N+1）：對 feed 裡的每一篇 post 再打一次 comments
  const withComments = [];
  for (const post of posts ?? []) {
    const { data: comments } = await supabase
      .from('comments')
      .select('id, body, author_id, created_at')
      .eq('post_id', post.id)
      .order('created_at', { ascending: true })
      .limit(3);
    withComments.push({ ...post, comments: comments ?? [] });
  }
  return withComments;
}

// 乾淨：單篇 post 用 pk 查，嵌入作者與留言
export async function loadPost(postId: string) {
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, body, created_at, profiles(username, avatar_url), comments(id, body, created_at)')
    .eq('id', postId)
    .single();
  if (error) throw error;
  return data;
}

// 乾淨：某篇 post 的留言分頁，有 range
export async function loadComments(postId: string, page: number) {
  const pageSize = 20;
  const { data, error } = await supabase
    .from('comments')
    .select('id, body, author_id, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
    .range(page * pageSize, (page + 1) * pageSize - 1);
  if (error) throw error;
  return data;
}
