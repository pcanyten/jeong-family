"use client";

import Image from "next/image";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FeedCommentSheet } from "./FeedCommentSheet";
import { PostFormModal } from "./PostFormModal";

type Profile = { id: string; display_name: string; avatar_url: string | null };

type Props = {
  post: {
    id: string;
    user_id: string;
    content: string | null;
    image_url: string | null;
    created_at: string;
    profiles: Profile | null;
  };
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
  currentUserId: string;
  isAdmin?: boolean;
};

export function FeedCard({
  post,
  likesCount: initialLikes,
  commentsCount,
  likedByMe: initialLiked,
  currentUserId,
  isAdmin = false,
}: Props) {
  const router = useRouter();
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [likedByMe, setLikedByMe] = useState(initialLiked);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentsCountState, setCommentsCountState] = useState(commentsCount);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const canEdit = currentUserId === post.user_id || isAdmin;

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuOpen]);

  async function toggleLike() {
    const res = await fetch("/api/posts/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        post_id: post.id,
        action: likedByMe ? "unlike" : "like",
      }),
    });
    if (!res.ok) return;
    if (likedByMe) {
      setLikesCount((c) => Math.max(0, c - 1));
      setLikedByMe(false);
    } else {
      setLikesCount((c) => c + 1);
      setLikedByMe(true);
    }
  }

  const profile = post.profiles;
  const displayName = profile?.display_name || "가족";

  return (
    <>
      <article className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <header className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-full bg-coral/20 flex items-center justify-center overflow-hidden flex-shrink-0">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt=""
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-coral font-bold text-lg">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dark-gray truncate">{displayName}</p>
            <p className="text-dark-gray/60 text-sm">
              {format(new Date(post.created_at), "yyyy.MM.dd HH:mm", { locale: ko })}
            </p>
          </div>
          {canEdit && (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className="p-2 rounded-full hover:bg-gray-100 text-dark-gray/60"
                aria-label="더보기"
                aria-expanded={menuOpen}
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {menuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 py-1 min-w-[120px] bg-white rounded-xl border border-gray-200 shadow-lg z-10"
                  role="menu"
                >
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-dark-gray hover:bg-gray-100 rounded-t-xl"
                    onClick={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 rounded-b-xl"
                    onClick={async () => {
                      setMenuOpen(false);
                      if (!confirm("이 게시글을 삭제할까요?")) return;
                      const res = await fetch(`/api/posts/${post.id}`, {
                        method: "DELETE",
                      });
                      if (res.ok) router.refresh();
                      else {
                        const data = await res.json();
                        alert(data.error || "삭제에 실패했습니다.");
                      }
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {post.image_url && (
          <div className="relative w-full aspect-square bg-gray-100">
            <Image
              src={post.image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 480px) 100vw, 480px"
            />
          </div>
        )}

        {post.content && (
          <div className="px-4 py-3">
            <p className="text-dark-gray text-base leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 px-4 pb-4">
          <button
            type="button"
            onClick={toggleLike}
            className={`flex items-center gap-2 min-h-[44px] px-2 rounded-xl transition ${
              likedByMe ? "text-coral" : "text-dark-gray/70"
            }`}
          >
            <Heart
              className="w-6 h-6"
              fill={likedByMe ? "currentColor" : "none"}
              strokeWidth={2}
            />
            <span className="text-base font-medium">
              {likesCount > 0 ? likesCount : "좋아요"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCommentOpen(true)}
            className="flex items-center gap-2 min-h-[44px] px-2 rounded-xl text-dark-gray/70 hover:text-dark-gray transition"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-base font-medium">
              {commentsCountState > 0 ? `댓글 ${commentsCountState}` : "댓글"}
            </span>
          </button>
        </div>
      </article>

      <FeedCommentSheet
        postId={post.id}
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        initialCount={commentsCountState}
        onCountChange={setCommentsCountState}
      />

      <PostFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSuccess={() => {
          setEditOpen(false);
          router.refresh();
        }}
        initialPost={{ id: post.id, content: post.content, image_url: post.image_url }}
      />
    </>
  );
}
