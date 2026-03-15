import { createServerSupabaseClient } from "@/lib/supabase/server";
import { CalendarView } from "@/components/calendar/CalendarView";

export default async function CalendarPage() {
  const supabase = await createServerSupabaseClient();
  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date, memo, user_id")
    .order("event_date", { ascending: true });

  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-dark-gray mb-4">일정 / 행사</h1>
      <CalendarView events={events || []} />
    </main>
  );
}
