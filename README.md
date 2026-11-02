# pggate-demo

A Lovable-style Supabase app (profiles, posts, comments, likes, follows) with five planted performance smells — the `fixtures/demo` project of [pggate](https://pggate.dev).

Every pull request runs [`yilinguo121/pggate/action`](https://github.com/yilinguo121/pggate) (`pggate check --profile scale --format md`) and leaves **one** comment: the EXPLAIN at 100k rows for every query, the line that falls over, and the fix proven on this schema — updated in place on every push, never a second comment.

| smell | where | finding |
|---|---|---|
| missing FK index | `supabase/migrations/20260101000100_indexes.sql` (no index on `posts.author_id`) | `SEQ_SCAN_AT_SCALE` · fix proven |
| `auth.uid()` not wrapped | `supabase/migrations/20260101000200_rls.sql` (`posts_select_published_or_own`) | `RLS_AUTH_NOT_INITPLAN` · fix proven |
| N+1 | `src/feed.ts` (`comments` per post) | `N_PLUS_ONE` |
| unbounded list | `src/feed.ts` (`loadFeed` has no limit) | `UNBOUNDED_LIST` |
| exact count on a big table | `src/profile.ts` (`countFollowers`) | `EXACT_COUNT_LARGE` |

Nothing here talks to a database: pggate builds the schema in a sandbox (PGlite), loads 100k synthetic rows, explains every query, applies each suggested fix and re-explains before calling it a fix.
