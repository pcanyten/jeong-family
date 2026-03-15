"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Plus } from "lucide-react";

type Photo = {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
};

type Props = { albumId: string; onBack: () => void };

export function AlbumPhotos({ albumId, onBack }: Props) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [albumYear, setAlbumYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function load() {
    const supabase = createClient();
    const { data: album } = await supabase
      .from("albums")
      .select("year")
      .eq("id", albumId)
      .single();
    if (album) setAlbumYear(album.year);
    const { data } = await supabase
      .from("photos")
      .select("id, image_url, caption, created_at")
      .eq("album_id", albumId)
      .order("created_at", { ascending: false });
    setPhotos((data as Photo[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [albumId]);

  const MAX_FILES = 10;

  async function uploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    const files = selected.filter((f) => f.type.startsWith("image/")).slice(0, MAX_FILES);
    if (files.length === 0) return;
    if (selected.length > MAX_FILES) {
      setUploadError(`최대 ${MAX_FILES}장까지 선택할 수 있습니다.`);
      return;
    }
    setUploadError("");
    setUploading(true);
    const formData = new FormData();
    formData.set("albumId", albumId);
    files.forEach((file) => formData.append("files", file));
    try {
      const res = await fetch("/api/upload/gallery", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error || "업로드에 실패했습니다.");
        return;
      }
      load();
    } catch {
      setUploadError("업로드에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <header className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="뒤로"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-dark-gray">
            {albumYear != null ? `${albumYear}년` : "사진"}
          </h2>
        </div>
        {uploadError && (
          <p className="mb-2 text-red-600 text-sm" role="alert">
            {uploadError}
          </p>
        )}
        <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-coral text-white font-semibold min-h-[44px] cursor-pointer disabled:opacity-60">
          <Plus className="w-5 h-5" />
          사진 올리기 (최대 10장)
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadPhoto}
            disabled={uploading}
            className="sr-only"
          />
        </label>
      </header>
      {loading ? (
        <p className="text-center text-dark-gray/70 py-12">불러오는 중...</p>
      ) : photos.length === 0 ? (
        <p className="text-center text-dark-gray/70 py-12">이 앨범에 사진이 없습니다. 위에서 올려보세요.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((p) => (
            <div
              key={p.id}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
            >
              <Image
                src={p.image_url}
                alt={p.caption || ""}
                fill
                className="object-cover"
                sizes="(max-width: 480px) 33vw, 160px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
