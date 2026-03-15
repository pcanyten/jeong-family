"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Heart, LogOut } from "lucide-react";

type Props = { displayName: string };

export function MainHeader({ displayName }: Props) {
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 bg-ivory/95 backdrop-blur border-b border-gray-200/80">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 text-dark-gray font-bold text-lg"
        >
          <Heart className="w-6 h-6 text-coral" />
          정씨네 이야기
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-dark-gray/70 text-sm hidden sm:inline">
            {displayName}
          </span>
          <button
            type="button"
            onClick={signOut}
            className="p-2 rounded-full hover:bg-gray-200 text-dark-gray/70 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="로그아웃"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
