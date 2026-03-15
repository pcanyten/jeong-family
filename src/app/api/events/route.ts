import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 일정 등록 */
export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { title, event_date, memo } = body as {
      title?: string;
      event_date?: string;
      memo?: string | null;
    };
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "제목을 입력해 주세요." },
        { status: 400 }
      );
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    const { error } = await client.from("events").insert({
      user_id: user.id,
      title: title.trim(),
      event_date: event_date || new Date().toISOString().slice(0, 10),
      memo: memo?.trim() || null,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "등록 실패" },
      { status: 500 }
    );
  }
}

/** 일정 수정 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { id, title, event_date, memo } = body as {
      id?: string;
      title?: string;
      event_date?: string;
      memo?: string | null;
    };
    if (!id || !title?.trim()) {
      return NextResponse.json(
        { error: "일정 ID와 제목이 필요합니다." },
        { status: 400 }
      );
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    const { error } = await client
      .from("events")
      .update({
        title: title.trim(),
        event_date: event_date || undefined,
        memo: memo?.trim() || null,
      })
      .eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "수정 실패" },
      { status: 500 }
    );
  }
}

/** 일정 삭제 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id 필요" }, { status: 400 });
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    const { error } = await client.from("events").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "삭제 실패" },
      { status: 500 }
    );
  }
}
