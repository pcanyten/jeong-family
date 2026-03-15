import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AdminMemberList } from "@/components/admin/AdminMemberList";

export default async function AdminPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user?.id)
    .single();

  if (!profile?.is_admin) {
    return (
      <main className="px-4 py-8">
        <p className="text-center text-dark-gray/70">관리자만 접근할 수 있습니다.</p>
      </main>
    );
  }

  return (
    <main className="px-4 py-4">
      <h1 className="text-xl font-bold text-dark-gray mb-4">회원 관리</h1>
      <p className="text-dark-gray/70 text-base mb-4">
        가입 신청한 가족을 승인해 주세요.
      </p>
      <AdminMemberList />
    </main>
  );
}
