"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  CreditCard,
  Tag,
  TrendingUp,
  Wallet,
  Settings,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: CreditCard, label: "Transactions", href: "/transactions" },
  { icon: Tag, label: "Categories", href: "/categories" },
  { icon: TrendingUp, label: "Analytics", href: "/analytics" },
  { icon: Wallet, label: "Wallet", href: "/wallet" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden animate-in fade-in duration-200"
          onClick={onClose}
          role="presentation"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-40 w-64
          bg-[var(--surface-base)] border-r border-[var(--border-default)]
          transform transition-transform duration-300 ease-out
          lg:translate-x-0 lg:w-72 lg:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full pt-20 pb-6">
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 lg:hidden p-2 rounded-lg hover:bg-[var(--surface-1)] transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 ease-out
                    ${
                      isActive
                        ? "bg-[var(--secondary-500)] text-white shadow-md"
                        : "text-[var(--text-secondary)] hover:bg-[var(--surface-1)] active:bg-[var(--surface-2)]"
                    }
                  `}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer - App info */}
          <div className="px-4 border-t border-[var(--border-default)] pt-4">
            <div className="p-3 bg-[var(--surface-1)] rounded-lg">
              <p className="text-xs font-semibold text-[var(--text-primary)]">
                Finance Dashboard
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                v1.0.0
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
