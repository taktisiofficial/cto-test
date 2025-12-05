"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, Search, Plus, Bell, Settings, User } from "lucide-react";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle scroll-aware states
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Close menus on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-40
      transition-all duration-300 ease-out
      ${isScrolled 
        ? 'bg-surface-overlay/95 backdrop-blur-xl border-b border-border-subtle shadow-lg' 
        : 'bg-surface-base/80 backdrop-blur-md border-b border-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side - Menu button and slimmer brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="
                rounded-lg p-3 transition-all duration-200
                hover:bg-surface-2 active:scale-95
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                lg:hidden
              "
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="
                flex h-8 w-8 items-center justify-center rounded-xl 
                bg-gradient-to-br from-primary to-primary-600 
                text-white font-bold text-sm
                shadow-md
              ">
                $
              </div>
              <h1 className="text-lg font-semibold text-primary hidden sm:block">
                Finance
              </h1>
            </div>
          </div>

          {/* Center - Search (desktop) or contextual quick actions */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="
                  w-full flex items-center gap-3 px-4 py-2.5
                  bg-surface-1 rounded-xl border border-border-subtle
                  hover:bg-surface-2 transition-colors duration-200
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                "
                aria-label="Search"
              >
                <Search className="h-4 w-4 text-tertiary" />
                <span className="text-sm text-tertiary">Search transactions...</span>
              </button>
              
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 p-4 bg-surface-base rounded-xl border border-border-subtle shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search transactions, categories..."
                    className="w-full px-3 py-2 bg-surface-1 rounded-lg border border-border-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    aria-label="Search input"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right side - Quick actions and user menu */}
          <div className="flex items-center gap-2">
            {/* Add button - contextual quick action */}
            <button
              className="
                rounded-xl p-2.5 bg-primary text-white
                hover:bg-primary-600 transition-colors duration-200
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                active:scale-95 shadow-md
              "
              aria-label="Add new transaction"
            >
              <Plus className="h-4 w-4" />
            </button>

            {/* Search button - mobile only */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="
                rounded-lg p-2.5 transition-all duration-200
                hover:bg-surface-2 active:scale-95
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                lg:hidden
              "
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <button
              className="
                relative rounded-lg p-2.5 transition-all duration-200
                hover:bg-surface-2 active:scale-95
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
              "
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-danger rounded-full" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="
                  rounded-lg p-2.5 transition-all duration-200
                  hover:bg-surface-2 active:scale-95
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                "
                aria-label="User menu"
                aria-expanded={isUserMenuOpen}
              >
                <User className="h-5 w-5" />
              </button>
              
              {isUserMenuOpen && (
                <div className="
                  absolute right-0 top-full mt-2 w-48
                  bg-surface-base rounded-xl border border-border-subtle
                  shadow-xl animate-in fade-in slide-in-from-top-2 duration-200
                ">
                  <div className="p-2">
                    <button className="
                      w-full rounded-lg px-4 py-2.5 text-left text-sm
                      hover:bg-surface-1 transition-colors duration-150
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                    ">
                      Profile
                    </button>
                    <button className="
                      w-full rounded-lg px-4 py-2.5 text-left text-sm
                      hover:bg-surface-1 transition-colors duration-150
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
                    ">
                      Settings
                    </button>
                    <hr className="my-2 border-border-subtle" />
                    <button className="
                      w-full rounded-lg px-4 py-2.5 text-left text-sm text-danger
                      hover:bg-danger/10 transition-colors duration-150
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger
                    ">
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}