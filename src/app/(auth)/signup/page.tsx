"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || email.split("@")[0] },
      },
    });
    setLoading(false);
    if (signUpError) {
      const msg = signUpError.message || "";
      if (msg.toLowerCase().includes("rate limit") || msg.includes("email rate limit exceeded")) {
        setError("요청이 너무 많습니다. 5~10분 후에 다시 시도해 주세요.");
      } else {
        setError(msg || "가입에 실패했습니다.");
      }
      return;
    }
    if (data.user) {
      await supabase
        .from("profiles")
        .update({ display_name: displayName || email.split("@")[0] })
        .eq("id", data.user.id);
    }
    router.push("/waiting");
    router.refresh();
  }

  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-coral/20 flex items-center justify-center">
          <Heart className="w-8 h-8 text-coral" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-dark-gray mb-1">정씨네 이야기</h1>
      <p className="text-dark-gray/80 text-lg mb-8">가족 가입</p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        <div>
          <label htmlFor="displayName" className="block text-dark-gray font-medium mb-2">
            이름 (닉네임)
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            autoComplete="name"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-dark-gray text-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            placeholder="홍길동"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-dark-gray font-medium mb-2">
            이메일
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-dark-gray text-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            placeholder="example@email.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-dark-gray font-medium mb-2">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-dark-gray text-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            placeholder="6자 이상"
          />
        </div>
        {error && (
          <p className="text-red-600 text-sm" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl bg-coral text-white font-semibold text-lg hover:bg-coral/90 active:scale-[0.98] disabled:opacity-60 transition"
        >
          {loading ? "가입 중..." : "가입 신청"}
        </button>
      </form>

      <p className="mt-4 text-dark-gray/70 text-sm">
        가입 후 관리자 승인까지 기다려 주세요.
      </p>
      <p className="mt-6 text-dark-gray/80 text-base">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-coral font-semibold underline">
          로그인
        </Link>
      </p>
    </div>
  );
}
