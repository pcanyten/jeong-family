"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { X, Send } from "lucide-react";

type Comment = {
  id: string;
  body: string;
  created_at: string;
  profiles: { display_name: string } | null;
};

type Props = {
  postId: string;
  open: boolean;
  onClose: () => void;
  initialCount: number;
  onCountChange: (n: number) => void;
};

export function FeedCommentSheet({
  postId,
  open,
  onClose,
  initialCount,
  onCountChange,
}: Props) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newBody, setNewBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!open || !postId) return;
    setLoading(true);
    fetch(`/api/comments?postId=${encodeURIComponent(postId)}`)
      .then((res) => res.json())
      .then((data) => {
        setComments(Array.isArray(data) ? (data as Comment[]) : []);
        onCountChange(Array.isArray(data) ? data.length : 0);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [open, postId, onCountChange]);

  async function submitComment() {
    const body = newBody.trim();
    if (!body) return;
    setSending(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setSending(false);
        return;
      }
      setNewBody("");
      setComments((prev) => [...prev, data as Comment]);
      onCountChange(comments.length + 1);
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-ivory"
      aria-modal="true"
      role="dialog"
      aria-label="댓글"
    >
      <header className="flex items-center justify-between h-14 px-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-semibold text-dark-gray">댓글</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <p className="text-dark-gray/70 text-center py-8">불러오는 중...</p>
        ) : comments.length === 0 ? (
          <p className="text-dark-gray/70 text-center py-8">첫 댓글을 남겨보세요.</p>
        ) : (
          comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark-gray">
                  {c.profiles?.display_name || "가족"}
                </p>
                <p className="text-dark-gray/90 text-base break-words">{c.body}</p>
                <p className="text-dark-gray/60 text-sm mt-1">
                  {format(new Date(c.created_at), "yyyy.MM.dd HH:mm", { locale: ko })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-gray-200 bg-white safe-area-pb">
        <div className="flex gap-2">
          <input
            type="text"
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitComment()}
            placeholder="댓글 입력..."
            className="flex-1 min-h-[48px] px-4 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-coral focus:border-coral outline-none"
          />
          <button
            type="button"
            onClick={submitComment}
            disabled={sending || !newBody.trim()}
            className="min-h-[48px] px-4 rounded-xl bg-coral text-white font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" /> 보내기
          </button>
        </div>
      </div>
    </div>
  );
}
