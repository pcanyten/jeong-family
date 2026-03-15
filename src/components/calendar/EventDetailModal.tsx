"use client";

import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

type Event = {
  id: string;
  title: string;
  event_date: string;
  memo: string | null;
  user_id: string;
};

type Props = {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
  onDeleted: () => void;
};

export function EventDetailModal({
  event,
  onClose,
  onEdit,
  onDeleted,
}: Props) {
  const [deleting, setDeleting] = useState(false);

  async function deleteEvent() {
    if (!confirm("이 일정을 삭제할까요?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/events?id=${encodeURIComponent(event.id)}`, {
        method: "DELETE",
      });
      if (res.ok) onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-dark-gray">일정</h2>
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
          <p className="text-2xl font-bold text-dark-gray">{event.title}</p>
          <p className="text-dark-gray/80">
            {format(new Date(event.event_date + "T00:00:00"), "yyyy년 M월 d일 (EEEE)", {
              locale: ko,
            })}
          </p>
          {event.memo && (
            <p className="text-dark-gray/90 whitespace-pre-wrap">{event.memo}</p>
          )}
        </div>
        <footer className="p-4 border-t flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 py-4 rounded-xl border border-gray-300 text-dark-gray font-semibold"
          >
            수정
          </button>
          <button
            type="button"
            onClick={deleteEvent}
            disabled={deleting}
            className="flex items-center justify-center gap-2 py-4 px-4 rounded-xl bg-red-50 text-red-600 font-semibold disabled:opacity-60"
          >
            <Trash2 className="w-5 h-5" /> 삭제
          </button>
        </footer>
      </div>
    </div>
  );
}
