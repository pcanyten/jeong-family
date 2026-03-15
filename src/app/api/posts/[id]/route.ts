import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 피드 게시글 삭제 — 작성자 또는 슈퍼관리자만 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    if (!postId) {
      return NextResponse.json(
        { error: "게시글 ID가 필요합니다." },
        { status: 400 }
      );
    }
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

    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;

    const { data: profile } = await client
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    const { data: post } = await client
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const isAuthor = post.user_id === user.id;
    const isAdmin = profile?.is_admin === true;
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "수정/삭제 권한이 없습니다." },
        { status: 403 }
      );
    }

    const { error } = await client.from("posts").delete().eq("id", postId);
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

/** 피드 게시글 수정 — 작성자 또는 슈퍼관리자만 (content만 수정) */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params;
    if (!postId) {
      return NextResponse.json(
        { error: "게시글 ID가 필요합니다." },
        { status: 400 }
      );
    }
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

    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;

    const { data: profile } = await client
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    const { data: post } = await client
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .single();

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const isAuthor = post.user_id === user.id;
    const isAdmin = profile?.is_admin === true;
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "수정/삭제 권한이 없습니다." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { content } = body as { content?: string | null };
    const payload: { content?: string | null } = {};
    if (content !== undefined) payload.content = content === "" ? null : content;

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await client
      .from("posts")
      .update(payload)
      .eq("id", postId);
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
