"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(signInError.message || "로그인에 실패했습니다.");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_approved")
      .eq("id", data.user.id)
      .single();
    if (!profile?.is_approved) {
      router.push("/waiting");
      return;
    }
    router.push(redirectTo);
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
      <p className="text-dark-gray/80 text-lg mb-8">가족 로그인</p>

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-dark-gray text-lg focus:ring-2 focus:ring-coral focus:border-coral outline-none"
            placeholder="비밀번호"
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
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p className="mt-6 text-dark-gray/80 text-base">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-coral font-semibold underline">
          가입하기
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center text-dark-gray/70 py-12">불러오는 중...</div>}>
      <LoginForm />
    </Suspense>
  );
}
