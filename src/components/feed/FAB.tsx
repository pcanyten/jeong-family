"use client";

import { useState } from "react";
import { Plus, ImagePlus, CalendarPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { PostFormModal } from "./PostFormModal";
import { EventFormModal } from "../calendar/EventFormModal";

export function FAB() {
  const [open, setOpen] = useState(false);
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const router = useRouter();

  function openPost() {
    setOpen(false);
    setPostModalOpen(true);
  }
  function openEvent() {
    setOpen(false);
    setEventModalOpen(true);
  }

  return (
    <>
      <div className="fixed bottom-24 right-4 z-30 flex flex-col items-end gap-3">
        {open && (
          <>
            <button
              type="button"
              onClick={openPost}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white shadow-lg border border-gray-200 text-dark-gray font-semibold text-base hover:bg-ivory active:scale-95 min-h-[52px]"
            >
              <ImagePlus className="w-6 h-6 text-coral" />
              사진 올리기
            </button>
            <button
              type="button"
              onClick={openEvent}
              className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white shadow-lg border border-gray-200 text-dark-gray font-semibold text-base hover:bg-ivory active:scale-95 min-h-[52px]"
            >
              <CalendarPlus className="w-6 h-6 text-coral" />
              일정 등록
            </button>
          </>
        )}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-14 h-14 rounded-full bg-coral text-white shadow-lg flex items-center justify-center hover:bg-coral/90 active:scale-95 transition"
          aria-label={open ? "메뉴 닫기" : "글쓰기 메뉴"}
        >
          <Plus
            className={`w-7 h-7 transition-transform ${open ? "rotate-45" : ""}`}
          />
        </button>
      </div>

      <PostFormModal
        open={postModalOpen}
        onClose={() => setPostModalOpen(false)}
        onSuccess={() => {
          setPostModalOpen(false);
          router.refresh();
        }}
      />
      <EventFormModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSuccess={() => {
          setEventModalOpen(false);
          router.refresh();
        }}
      />
    </>
  );
}
