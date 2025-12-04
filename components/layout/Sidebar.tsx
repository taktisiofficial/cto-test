"use client";

import { Home, TrendingUp, Wallet, PieChart, Settings, X, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: CreditCard, label: "Transactions", href: "/transactions" },
  { icon: TrendingUp, label: "Trends", href: "/trends" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: PieChart, label: "Analytics", href: "/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 lg:sticky lg:top-16 lg:z-0 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800 lg:hidden">
            <h2 className="text-lg font-semibold">Menu</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-secondary/10 text-secondary font-medium"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="rounded-lg bg-secondary/10 p-4">
              <h3 className="text-sm font-semibold text-secondary">
                Need Help?
              </h3>
              <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                Visit our documentation for guides and tutorials.
              </p>
              <button className="mt-3 w-full rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-light">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
