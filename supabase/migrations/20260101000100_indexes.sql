-- 壞味道 1（缺 FK index）：public.posts.author_id 刻意沒有索引。
-- 其他 FK 都有索引，所以 splinter unindexed_foreign_keys 應該恰好抓到一個。

create index comments_post_id_created_at_idx on public.comments (post_id, created_at);
create index comments_author_id_idx on public.comments (author_id);
create index likes_post_id_idx on public.likes (post_id);
create index follows_followee_id_idx on public.follows (followee_id);
create index posts_created_at_idx on public.posts (created_at desc);
