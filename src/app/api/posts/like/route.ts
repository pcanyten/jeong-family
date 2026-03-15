import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 좋아요 토글 */
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
    const { post_id, action } = body as { post_id?: string; action?: "like" | "unlike" };
    if (!post_id || !action) {
      return NextResponse.json(
        { error: "post_id와 action이 필요합니다." },
        { status: 400 }
      );
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    if (action === "unlike") {
      await client
        .from("post_likes")
        .delete()
        .eq("post_id", post_id)
        .eq("user_id", user.id);
      return NextResponse.json({ liked: false });
    }
    await client.from("post_likes").upsert(
      { post_id, user_id: user.id },
      { onConflict: "post_id,user_id" }
    );
    return NextResponse.json({ liked: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "실패" },
      { status: 500 }
    );
  }
}
