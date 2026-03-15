import { createServerSupabaseClient } from "@/lib/supabase/server";
import { FeedCard } from "./FeedCard";

export async function MainFeed() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: myProfile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = myProfile?.is_admin === true;

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      user_id,
      content,
      image_url,
      created_at,
      profiles ( id, display_name, avatar_url )
    `
    )
    .order("created_at", { ascending: false })
    .limit(50);

  const postIds = (posts || []).map((p) => p.id);
  const { data: likes } =
    postIds.length > 0
      ? await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", user.id)
          .in("post_id", postIds)
      : { data: [] };
  const likedSet = new Set((likes || []).map((l) => l.post_id));

  const { data: commentCounts } =
    postIds.length > 0
      ? await supabase
          .from("comments")
          .select("post_id")
          .in("post_id", postIds)
      : { data: [] };
  const countByPost: Record<string, number> = {};
  (commentCounts || []).forEach((c: { post_id: string }) => {
    countByPost[c.post_id] = (countByPost[c.post_id] || 0) + 1;
  });

  const { data: likeCounts } =
    postIds.length > 0
      ? await supabase
          .from("post_likes")
          .select("post_id")
          .in("post_id", postIds)
      : { data: [] };
  const likeCountByPost: Record<string, number> = {};
  (likeCounts || []).forEach((l: { post_id: string }) => {
    likeCountByPost[l.post_id] = (likeCountByPost[l.post_id] || 0) + 1;
  });

  return (
    <section className="px-4 py-4 space-y-4" aria-label="피드">
      {(posts || []).length === 0 ? (
        <p className="text-center text-dark-gray/70 py-12 text-lg">
          아직 올라온 글이 없어요. 첫 게시글을 올려보세요!
        </p>
      ) : (
        (posts || []).map((post) => (
          <FeedCard
            key={post.id}
            post={{
              ...post,
              profiles: post.profiles as { id: string; display_name: string; avatar_url: string | null } | null,
            }}
            likesCount={likeCountByPost[post.id] || 0}
            commentsCount={countByPost[post.id] || 0}
            likedByMe={likedSet.has(post.id)}
            currentUserId={user.id}
            isAdmin={isAdmin}
          />
        ))
      )}
    </section>
  );
}
