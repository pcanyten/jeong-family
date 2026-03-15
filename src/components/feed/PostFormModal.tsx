"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

type InitialPost = { id: string; content: string | null; image_url: string | null };

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialPost?: InitialPost | null;
};

const MAX_FILES = 10;

export function PostFormModal({ open, onClose, onSuccess, initialPost }: Props) {
  const isEdit = Boolean(initialPost?.id);
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && initialPost) {
      setContent(initialPost.content ?? "");
      setFiles([]);
      setPreviews([]);
    } else if (open && !initialPost) {
      setContent("");
      setFiles([]);
      setPreviews([]);
    }
  }, [open, initialPost]);

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const imageFiles = selected
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, MAX_FILES);
    if (imageFiles.length === 0) {
      setError("이미지 파일만 올려주세요.");
      return;
    }
    if (selected.length > MAX_FILES) {
      setError(`최대 ${MAX_FILES}장까지 선택할 수 있습니다.`);
    }
    setFiles(imageFiles);
    setPreviews(imageFiles.map((f) => URL.createObjectURL(f)));
    setError("");
  }

  async function submit() {
    setError("");
    setLoading(true);
    try {
      if (isEdit && initialPost) {
        const res = await fetch(`/api/posts/${initialPost.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content.trim() || null }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "수정에 실패했습니다.");
          return;
        }
        onSuccess();
      } else {
        const formData = new FormData();
        formData.set("content", content.trim());
        files.forEach((f) => formData.append("files", f));
        const res = await fetch("/api/upload/feed", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "올리기에 실패했습니다.");
          return;
        }
        setContent("");
        setFiles([]);
        setPreviews([]);
        onSuccess();
      }
    } catch {
      setError(isEdit ? "수정에 실패했습니다. 다시 시도해 주세요." : "올리기에 실패했습니다. 다시 시도해 주세요.");
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
            {isEdit ? "게시글 수정" : "사진 올리기"}
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
        <div className="p-4 overflow-y-auto flex-1">
          {!isEdit && (
            <label className="block mb-4">
              <span className="block text-dark-gray font-medium mb-2">
                사진 (선택, 최대 {MAX_FILES}장)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={onFileChange}
                className="block w-full text-base"
              />
              {previews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {previews.map((src, i) => (
                    <img
                      key={src}
                      src={src}
                      alt={`미리보기 ${i + 1}`}
                      className="rounded-xl h-24 w-24 object-cover"
                    />
                  ))}
                </div>
              )}
            </label>
          )}
          {isEdit && initialPost?.image_url && (
            <div className="mb-4">
              <span className="block text-dark-gray font-medium mb-2">현재 사진</span>
              <img
                src={initialPost.image_url}
                alt=""
                className="rounded-xl max-h-40 object-cover"
              />
              <p className="text-dark-gray/60 text-sm mt-1">사진은 수정할 수 없습니다.</p>
            </div>
          )}
          <label className="block">
            <span className="block text-dark-gray font-medium mb-2">내용 (선택)</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="무슨 일이 있었나요?"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 text-base focus:ring-2 focus:ring-coral focus:border-coral outline-none resize-none"
            />
          </label>
          {error && (
            <p className="mt-2 text-red-600 text-sm" role="alert">
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
            {loading ? (isEdit ? "수정 중..." : "올리는 중...") : isEdit ? "수정하기" : "올리기"}
          </button>
        </footer>
      </div>
    </div>
  );
}
