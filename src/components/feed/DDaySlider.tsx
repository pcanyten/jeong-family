"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Item = {
  id: string;
  title: string;
  date: string;
  dday: string | null;
  formatted: string;
};

export function DDaySlider({ items }: { items: Item[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const step = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -step : step,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow text-dark-gray hover:bg-ivory active:scale-95"
        aria-label="이전"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scroll-smooth scrollbar-hide px-12 py-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-[180px] rounded-xl bg-white border border-gray-200 p-4 shadow-sm"
          >
            <span className="block text-coral font-bold text-lg">{item.dday}</span>
            <span className="block text-dark-gray font-medium truncate">{item.title}</span>
            <span className="block text-dark-gray/70 text-sm mt-1">{item.formatted}</span>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow text-dark-gray hover:bg-ivory active:scale-95"
        aria-label="다음"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
