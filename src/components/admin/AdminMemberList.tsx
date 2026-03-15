"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

type Profile = {
  id: string;
  display_name: string;
  is_approved: boolean;
  is_admin: boolean;
  created_at: string;
};

export function AdminMemberList() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/members", { cache: "no-store" });
      if (!res.ok) {
        setProfiles([]);
        return;
      }
      const data = await res.json();
      setProfiles((data as Profile[]) || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id: string) {
    setApprovingId(id);
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_approved: true } : p))
        );
      }
    } finally {
      setApprovingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-coral" />
      </div>
    );
  }

  const pending = profiles.filter((p) => !p.is_approved);
  const approved = profiles.filter((p) => p.is_approved);

  return (
    <div className="space-y-6">
      {pending.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-dark-gray mb-3">
            승인 대기 ({pending.length})
          </h2>
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 font-semibold text-dark-gray">이름</th>
                  <th className="px-4 py-3 font-semibold text-dark-gray">가입일</th>
                  <th className="px-4 py-3 font-semibold text-dark-gray w-24">
                    승인
                  </th>
                </tr>
              </thead>
              <tbody>
                {pending.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-dark-gray">
                      {p.display_name}
                    </td>
                    <td className="px-4 py-3 text-dark-gray/70 text-sm">
                      {new Date(p.created_at).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => approve(p.id)}
                        disabled={approvingId === p.id}
                        className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-coral text-white font-medium text-sm min-h-[44px] disabled:opacity-60"
                      >
                        {approvingId === p.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4" /> 승인
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
      <section>
        <h2 className="text-lg font-semibold text-dark-gray mb-3">전체 가족</h2>
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 font-semibold text-dark-gray">이름</th>
                <th className="px-4 py-3 font-semibold text-dark-gray">상태</th>
                <th className="px-4 py-3 font-semibold text-dark-gray">가입일</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 last:border-0"
                >
                  <td className="px-4 py-3 font-medium text-dark-gray">
                    {p.display_name}
                    {p.is_admin && (
                      <span className="ml-2 text-xs text-coral">관리자</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        p.is_approved ? "text-green-600" : "text-amber-600"
                      }`}
                    >
                      {p.is_approved ? "승인됨" : "대기"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-dark-gray/70 text-sm">
                    {new Date(p.created_at).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
