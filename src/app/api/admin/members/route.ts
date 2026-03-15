import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

type Profile = {
  id: string;
  display_name: string;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
};

/** 관리자: 회원 목록 (service role로 RLS 우회) */
export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = createServerSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }
  const { data: myProfile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!myProfile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { data } = await admin
    .from("profiles")
    .select("id, display_name, is_approved, is_admin, created_at")
    .order("created_at", { ascending: false });
  return NextResponse.json((data as Profile[]) || []);
}

/** 관리자: 회원 승인 */
export async function PATCH(request: Request) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const admin = createServerSupabaseAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Server config error" }, { status: 500 });
  }
  const { data: myProfile } = await admin
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!myProfile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json();
  const { id } = body as { id?: string };
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  await admin.from("profiles").update({ is_approved: true }).eq("id", id);
  return NextResponse.json({ ok: true });
}
