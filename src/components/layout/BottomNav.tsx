"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Image, Users } from "lucide-react";

type Props = { isAdmin: boolean };

export function BottomNav({ isAdmin }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "피드", icon: Home },
    { href: "/calendar", label: "일정", icon: Calendar },
    { href: "/gallery", label: "사진첩", icon: Image },
    ...(isAdmin ? [{ href: "/admin", label: "회원관리", icon: Users }] : []),
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-200 safe-area-pb z-40"
      aria-label="하단 메뉴"
    >
      <ul className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 min-w-[72px] min-h-[56px] rounded-xl transition ${
                  isActive ? "text-coral font-semibold" : "text-dark-gray/70"
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
