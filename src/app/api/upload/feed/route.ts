import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/** 피드 사진/글 업로드 — 서버에서 쿠키로 로그인 확인 후 업로드 */
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
    const content = (formData.get("content") as string | null)?.trim() || null;
    const singleFile = formData.get("file") as File | null;
    const multiFiles = formData.getAll("files") as File[];
    const files = multiFiles.length > 0 ? multiFiles : (singleFile ? [singleFile] : []);

    const imageFiles = files.filter(
      (f) => f.size > 0 && f.type.startsWith("image/")
    ).slice(0, 10);
    if (imageFiles.length > 10) {
      return NextResponse.json(
        { error: "최대 10장까지 올릴 수 있습니다." },
        { status: 400 }
      );
    }

    const admin = createServerSupabaseAdminClient();
    const client = admin ?? supabase;

    if (imageFiles.length === 0) {
      const { error: insertError } = await client.from("posts").insert({
        user_id: user.id,
        content,
        image_url: null,
      });
      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    for (const file of imageFiles) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `feed/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const buf = await file.arrayBuffer();
      const { error: uploadError } = await client.storage
        .from("feed")
        .upload(path, buf, { contentType: file.type, upsert: true });
      if (uploadError) {
        return NextResponse.json(
          { error: `사진 업로드 실패: ${uploadError.message}` },
          { status: 500 }
        );
      }
      const { data: urlData } = client.storage.from("feed").getPublicUrl(path);
      const { error: insertError } = await client.from("posts").insert({
        user_id: user.id,
        content,
        image_url: urlData.publicUrl,
      });
      if (insertError) {
        return NextResponse.json(
          { error: insertError.message },
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
