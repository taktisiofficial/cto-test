"use client";

import { Menu, Bell, Settings, User } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white font-bold">
              $
            </div>
            <h1 className="text-xl font-bold text-foreground">
              Finance Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>
          <button
            className="hidden sm:flex rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="User menu"
            >
              <User className="h-5 w-5" />
            </button>
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900">
                <div className="p-2">
                  <button className="w-full rounded-lg px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                    Profile
                  </button>
                  <button className="w-full rounded-lg px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
                    Settings
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-800" />
                  <button className="w-full rounded-lg px-4 py-2 text-left text-sm text-danger hover:bg-gray-100 dark:hover:bg-gray-800">
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
