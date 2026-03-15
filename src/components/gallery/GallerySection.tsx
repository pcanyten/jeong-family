"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, ChevronRight, Plus } from "lucide-react";
import { AlbumPhotos } from "./AlbumPhotos";
import { AlbumCreateModal } from "./AlbumCreateModal";

type Album = { id: string; year: number; title: string | null };

export function GallerySection({ albums }: { albums: Album[] }) {
  const [openAlbumId, setOpenAlbumId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const router = useRouter();

  if (albums.length === 0 && !createOpen) {
    return (
      <>
        <p className="text-dark-gray/70 text-center py-8 text-lg">
          아직 앨범이 없어요.
        </p>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="w-full py-4 rounded-xl bg-coral text-white font-semibold flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> 첫 앨범 만들기
        </button>
        <AlbumCreateModal
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSuccess={() => router.refresh()}
        />
      </>
    );
  }

  if (openAlbumId) {
    return (
      <AlbumPhotos
        albumId={openAlbumId}
        onBack={() => setOpenAlbumId(null)}
      />
    );
  }

  return (
    <>
      <ul className="space-y-2">
        {albums.map((a) => (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => setOpenAlbumId(a.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-ivory active:scale-[0.99] min-h-[56px] text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-coral/20 flex items-center justify-center flex-shrink-0">
                <Folder className="w-6 h-6 text-coral" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-dark-gray text-lg">{a.year}년</p>
                {a.title && (
                  <p className="text-dark-gray/70 text-sm truncate">{a.title}</p>
                )}
              </div>
              <ChevronRight className="w-5 h-5 text-dark-gray/50 flex-shrink-0" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => setCreateOpen(true)}
        className="mt-4 w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-dark-gray/70 font-medium flex items-center justify-center gap-2 min-h-[52px]"
      >
        <Plus className="w-5 h-5" /> 앨범 추가
      </button>
      <AlbumCreateModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={() => router.refresh()}
      />
    </>
  );
}
