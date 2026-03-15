import { createServerSupabaseClient } from "@/lib/supabase/server";
import { GallerySection } from "@/components/gallery/GallerySection";

export default async function GalleryPage() {
  const supabase = await createServerSupabaseClient();
  const { data: albums } = await supabase
    .from("albums")
    .select("id, year, title")
    .order("year", { ascending: false });

  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-dark-gray mb-4">사진첩 / 아카이브</h1>
      <GallerySection albums={albums || []} />
    </main>
  );
}

