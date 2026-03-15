import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 승인 여부를 서버 기준으로 확인. 가능하면 RLS 우회(admin)로 프로필 읽기 */
export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ approved: false }, { status: 401 });
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    const { data: profile } = await client
      .from("profiles")
      .select("is_approved")
      .eq("id", user.id)
      .single();
    return NextResponse.json({
      approved: profile?.is_approved === true,
    });
  } catch {
    return NextResponse.json({ approved: false }, { status: 500 });
  }
}
