import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 댓글 목록 조회 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId) {
    return NextResponse.json({ error: "postId 필요" }, { status: 400 });
  }
  try {
    const admin = createServerSupabaseAdminClient();
    const supabase = await createServerSupabaseClient();
    const client = admin ?? supabase;
    const { data } = await client
      .from("comments")
      .select("id, body, created_at, profiles ( display_name )")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "조회 실패" },
      { status: 500 }
    );
  }
}

/** 댓글 등록 */
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
    const { post_id, body: commentBody } = body as { post_id?: string; body?: string };
    if (!post_id || !commentBody?.trim()) {
      return NextResponse.json(
        { error: "게시글과 댓글 내용이 필요합니다." },
        { status: 400 }
      );
    }
    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;
    const { data: inserted, error } = await client
      .from("comments")
      .insert({ post_id, user_id: user.id, body: commentBody.trim() })
      .select("id, body, created_at, profiles ( display_name )")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(inserted);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "등록 실패" },
      { status: 500 }
    );
  }
}
