"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { format } from "date-fns";

type Event = {
  id: string;
  title: string;
  event_date: string;
  memo: string | null;
  user_id: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editEvent?: Event;
};

export function EventFormModal({
  open,
  onClose,
  onSuccess,
  editEvent,
}: Props) {
  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [memo, setMemo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editEvent) {
      setTitle(editEvent.title);
      setEventDate(editEvent.event_date);
      setMemo(editEvent.memo || "");
    } else {
      setTitle("");
      setEventDate(format(new Date(), "yyyy-MM-dd"));
      setMemo("");
    }
  }, [editEvent, open]);

  async function submit() {
    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (editEvent) {
        const res = await fetch("/api/events", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editEvent.id,
            title: title.trim(),
            event_date: eventDate,
            memo: memo.trim() || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "수정에 실패했습니다.");
          return;
        }
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: title.trim(),
            event_date: eventDate,
            memo: memo.trim() || null,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "등록에 실패했습니다.");
          return;
        }
      }
      onSuccess();
    } catch {
      setError("등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-dark-gray">
            {editEvent ? "일정 수정" : "일정 등록"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </header>
        <div className="p-4 space-y-4">
          <label className="block">
            <span className="block text-dark-gray font-medium mb-2">제목 *</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 큰외삼촌 환갑"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-dark-gray font-medium mb-2">날짜</span>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-dark-gray font-medium mb-2">메모 (선택)</span>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="장소, 시간 등"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-coral focus:border-coral outline-none resize-none"
            />
          </label>
          {error && (
            <p className="text-red-600 text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
        <footer className="p-4 border-t">
          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-coral text-white font-semibold text-lg disabled:opacity-60"
          >
            {loading ? "저장 중..." : editEvent ? "수정" : "등록"}
          </button>
        </footer>
      </div>
    </div>
  );
}
