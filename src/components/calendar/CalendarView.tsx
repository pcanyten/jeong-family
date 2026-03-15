"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
} from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { EventFormModal } from "./EventFormModal";
import { EventDetailModal } from "./EventDetailModal";

type Event = {
  id: string;
  title: string;
  event_date: string;
  memo: string | null;
  user_id: string;
};

export function CalendarView({ events }: { events: Event[] }) {
  const [current, setCurrent] = useState(new Date());
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [detailEvent, setDetailEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const eventsByDate = useMemo(() => {
    const map: Record<string, Event[]> = {};
    events.forEach((e) => {
      const d = e.event_date;
      if (!map[d]) map[d] = [];
      map[d].push(e);
    });
    return map;
  }, [events]);

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const rows: Date[] = [];
  let d = calStart;
  while (d <= calEnd) {
    rows.push(d);
    d = addDays(d, 1);
  }
  const weeks = [];
  for (let i = 0; i < rows.length; i += 7) {
    weeks.push(rows.slice(i, i + 7));
  }

  function openDetail(dateStr: string) {
    const list = eventsByDate[dateStr];
    if (list && list.length > 0) setDetailEvent(list[0]);
    else setDetailEvent(null);
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="flex items-center justify-between p-4 border-b">
          <button
            type="button"
            onClick={() => setCurrent(subMonths(current, 1))}
            className="p-2 rounded-full hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="이전 달"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-dark-gray">
            {format(current, "yyyy년 M월", { locale: ko })}
          </h2>
          <button
            type="button"
            onClick={() => setCurrent(addMonths(current, 1))}
            className="p-2 rounded-full hover:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="다음 달"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <table className="w-full text-center" role="grid">
          <thead>
            <tr className="text-dark-gray/70 text-sm">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <th key={day} className="py-2 font-medium">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, wi) => (
              <tr key={wi}>
                {week.map((day) => {
                  const dateStr = format(day, "yyyy-MM-dd");
                  const dayEvents = eventsByDate[dateStr] || [];
                  const inMonth = isSameMonth(day, current);
                  const today = isToday(day);
                  return (
                    <td
                      key={dateStr}
                      className={`p-1 align-top border-t border-gray-100 ${
                        !inMonth ? "text-gray-300" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => openDetail(dateStr)}
                        className={`w-full min-h-[44px] rounded-lg flex flex-col items-center justify-center text-base ${
                          today ? "bg-coral/20 font-semibold text-coral" : ""
                        } ${inMonth ? "text-dark-gray hover:bg-gray-100" : ""}`}
                      >
                        <span>{format(day, "d")}</span>
                        {dayEvents.length > 0 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-coral mt-0.5" />
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-dark-gray mb-3">
          이번 달 일정
        </h2>
        <ul className="space-y-3">
          {events
            .filter(
              (e) =>
                e.event_date >= format(monthStart, "yyyy-MM-dd") &&
                e.event_date <= format(monthEnd, "yyyy-MM-dd")
            )
            .map((e) => (
              <li
                key={e.id}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200"
              >
                <span className="text-coral font-bold text-sm whitespace-nowrap">
                  {format(new Date(e.event_date + "T00:00:00"), "M/d", {
                    locale: ko,
                  })}
                </span>
                <span className="font-medium text-dark-gray flex-1 truncate">
                  {e.title}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingEvent(e)}
                  className="text-coral text-sm font-medium"
                >
                  수정
                </button>
              </li>
            ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            setEditingEvent(null);
            setEventModalOpen(true);
          }}
          className="mt-4 w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-dark-gray/70 font-medium flex items-center justify-center gap-2 min-h-[52px]"
        >
          <Plus className="w-5 h-5" /> 일정 추가
        </button>
      </section>

      <EventFormModal
        open={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        onSuccess={() => {
          setEventModalOpen(false);
          window.location.reload();
        }}
        editEvent={editingEvent ?? undefined}
      />
      {detailEvent && (
        <EventDetailModal
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onEdit={() => {
            setDetailEvent(null);
            setEditingEvent(detailEvent);
            setEventModalOpen(true);
          }}
          onDeleted={() => {
            setDetailEvent(null);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}
