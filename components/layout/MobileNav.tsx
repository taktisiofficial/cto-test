"use client";

import { Home, TrendingUp, Wallet, Tag, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: CreditCard, label: "Txns", href: "/transactions" },
  { icon: Tag, label: "Categories", href: "/categories" },
  { icon: TrendingUp, label: "Trends", href: "/trends" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80 lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 transition-colors ${
                isActive
                  ? "text-secondary"
                  : "text-gray-600 hover:text-foreground dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
