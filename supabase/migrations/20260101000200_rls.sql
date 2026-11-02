alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.likes enable row level security;
alter table public.follows enable row level security;

-- profiles：公開可讀，只能改自己的
create policy "profiles_select_all" on public.profiles
  for select to anon, authenticated using (true);
create policy "profiles_insert_own" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "profiles_update_own" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- posts：已發佈的公開可讀，草稿只有作者看得到
-- 壞味道 2（未包裝 auth.uid()）：auth.uid() 沒有包成 (select auth.uid())，authenticated 下每列重算。
create policy "posts_select_published_or_own" on public.posts
  for select to anon, authenticated using (published or auth.uid() = author_id);
create policy "posts_insert_own" on public.posts
  for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "posts_update_own" on public.posts
  for update to authenticated using ((select auth.uid()) = author_id) with check ((select auth.uid()) = author_id);
create policy "posts_delete_own" on public.posts
  for delete to authenticated using ((select auth.uid()) = author_id);

-- comments
create policy "comments_select_all" on public.comments
  for select to anon, authenticated using (true);
create policy "comments_insert_own" on public.comments
  for insert to authenticated with check ((select auth.uid()) = author_id);
create policy "comments_delete_own" on public.comments
  for delete to authenticated using ((select auth.uid()) = author_id);

-- likes
create policy "likes_select_all" on public.likes
  for select to anon, authenticated using (true);
create policy "likes_insert_own" on public.likes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "likes_delete_own" on public.likes
  for delete to authenticated using ((select auth.uid()) = user_id);

-- follows
create policy "follows_select_all" on public.follows
  for select to anon, authenticated using (true);
create policy "follows_insert_own" on public.follows
  for insert to authenticated with check ((select auth.uid()) = follower_id);
create policy "follows_delete_own" on public.follows
  for delete to authenticated using ((select auth.uid()) = follower_id);
