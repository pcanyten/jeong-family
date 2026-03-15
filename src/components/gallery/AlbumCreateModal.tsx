"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AlbumCreateModal({ open, onClose, onSuccess }: Props) {
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, title: `${year}년` }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "추가에 실패했습니다.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("추가에 실패했습니다.");
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
      <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-dark-gray">앨범 추가</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="닫기"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <label className="block mb-4">
          <span className="block text-dark-gray font-medium mb-2">연도</span>
          <input
            type="number"
            min={1990}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base"
          />
        </label>
        {error && (
          <p className="text-red-600 text-sm mb-4" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={submit}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-coral text-white font-semibold disabled:opacity-60"
        >
          {loading ? "추가 중..." : "추가"}
        </button>
      </div>
    </div>
  );
}
