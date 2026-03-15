import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 사진첩 사진 업로드 — 서버에서 쿠키로 로그인 확인 후 업로드 */
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

    const formData = await request.formData();
    const albumId = formData.get("albumId") as string | null;
    const singleFile = formData.get("file") as File | null;
    const multiFiles = formData.getAll("files") as File[];
    const files = multiFiles.length > 0 ? multiFiles : (singleFile ? [singleFile] : []);

    if (!files.length || !albumId) {
      return NextResponse.json(
        { error: "파일과 앨범을 선택해 주세요." },
        { status: 400 }
      );
    }
    if (files.length > 10) {
      return NextResponse.json(
        { error: "최대 10장까지 올릴 수 있습니다." },
        { status: 400 }
      );
    }

    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;

    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      const ext = file.name.split(".").pop() || "jpg";
      const path = `gallery/${albumId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buf = await file.arrayBuffer();
      const { error: uploadError } = await client.storage
        .from("gallery")
        .upload(path, buf, { contentType: file.type, upsert: true });
      if (uploadError) {
        return NextResponse.json(
          { error: `업로드 실패: ${uploadError.message}` },
          { status: 500 }
        );
      }
      const { data: urlData } = client.storage.from("gallery").getPublicUrl(path);
      const { error: insertError } = await client.from("photos").insert({
        album_id: albumId,
        user_id: user.id,
        image_url: urlData.publicUrl,
      });
      if (insertError) {
        return NextResponse.json(
          { error: `저장 실패: ${insertError.message}` },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "업로드 실패" },
      { status: 500 }
    );
  }
}
