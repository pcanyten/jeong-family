import { createServerSupabaseClient } from "@/lib/supabase/server";
import { format, differenceInDays } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DDaySlider } from "./DDaySlider";

export async function DDayBar() {
  const supabase = await createServerSupabaseClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date")
    .gte("event_date", format(today, "yyyy-MM-dd"))
    .order("event_date", { ascending: true })
    .limit(10);

  const items = (events || []).map((e) => {
    const d = new Date(e.event_date + "T00:00:00");
    const days = differenceInDays(d, today);
    return {
      id: e.id,
      title: e.title,
      date: e.event_date,
      dday: days === 0 ? "D-Day" : days > 0 ? `D-${days}` : null,
      formatted: format(d, "M월 d일 (EEE)", { locale: ko }),
    };
  }).filter((x) => x.dday !== null);

  if (items.length === 0) {
    return (
      <div className="sticky top-0 z-30 bg-ivory/95 backdrop-blur border-b border-gray-200/80 py-3 px-4">
        <p className="text-dark-gray/70 text-center text-base">다가올 일정이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 z-30 bg-ivory/95 backdrop-blur border-b border-gray-200/80 py-3">
      <p className="px-4 text-dark-gray/80 text-sm font-medium mb-2">다가올 주요 일정</p>
      <DDaySlider items={items} />
    </div>
  );
}
