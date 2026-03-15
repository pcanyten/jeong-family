import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 앨범 추가 */
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
    const { year, title } = body as { year?: number; title?: string };
    if (year == null) {
      return NextResponse.json(
        { error: "연도를 입력해 주세요." },
        { status: 400 }
      );
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    const { error } = await client.from("albums").insert({
      year: Number(year),
      title: title?.trim() || `${year}년`,
    });
    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "이미 존재하는 연도입니다." },
          { status: 400 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "추가 실패" },
      { status: 500 }
    );
  }
}
