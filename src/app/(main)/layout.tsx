import {
  createServerSupabaseClient,
  createServerSupabaseAdminClient,
} from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { MainHeader } from "@/components/layout/MainHeader";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createServerSupabaseAdminClient();
  const client = admin ?? supabase;
  const { data: profile } = await client
    .from("profiles")
    .select("is_approved, is_admin, display_name")
    .eq("id", user.id)
    .single();
  if (!profile?.is_approved) redirect("/waiting");

  return (
    <div className="min-h-screen bg-ivory pb-20">
      <MainHeader displayName={profile.display_name} />
      {children}
      <BottomNav isAdmin={profile.is_admin} />
    </div>
  );
}
