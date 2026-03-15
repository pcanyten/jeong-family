"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Heart, LogOut, RefreshCw } from "lucide-react";

export default function WaitingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/login");
        return;
      }
      setChecking(false);
    });
  }, [router]);

  const [checkingApproval, setCheckingApproval] = useState(false);
  const [message, setMessage] = useState("");

  async function checkApproval() {
    setMessage("");
    setCheckingApproval(true);
    try {
      const res = await fetch("/api/check-approval", { cache: "no-store" });
      const data = await res.json();
      if (data.approved) {
        window.location.href = "/";
        return;
      }
      setMessage("아직 승인되지 않았습니다.");
    } catch {
      setMessage("확인에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setCheckingApproval(false);
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <p className="text-dark-gray/80">확인 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col items-center justify-center px-6 py-8">
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 rounded-full bg-coral/20 flex items-center justify-center">
          <Heart className="w-10 h-10 text-coral" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-dark-gray mb-2">정씨네 이야기</h1>
      <p className="text-dark-gray text-lg text-center leading-relaxed mb-8">
        관리자의 승인을 기다리고 있습니다.
        <br />
        승인되면 자동으로 메인 화면으로 이동합니다.
      </p>
      {message && (
        <p className="mb-3 text-center text-dark-gray/80 text-sm">{message}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={checkApproval}
          disabled={checkingApproval}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-coral text-white font-semibold hover:bg-coral/90 active:scale-[0.98] transition disabled:opacity-70"
        >
          <RefreshCw className={`w-5 h-5 ${checkingApproval ? "animate-spin" : ""}`} />
          {checkingApproval ? "확인 중..." : "승인 여부 확인"}
        </button>
        <button
          type="button"
          onClick={handleSignOut}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-gray-300 text-dark-gray font-medium hover:bg-gray-100 active:scale-[0.98] transition"
        >
          <LogOut className="w-5 h-5" />
          로그아웃
        </button>
      </div>
    </div>
  );
}