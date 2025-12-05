use client

import { useState, useEffect } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Handle keyboard visibility for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const height = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        setIsKeyboardVisible(windowHeight - height > 200);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      return () => window.visualViewport.removeEventListener('resize', handleResize);
    }
  }, []);

  // Handle ESC key for sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    if (isSidebarOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isSidebarOpen]);

  return (
    <div className="relative min-h-screen surface-base">
      {/* Animated gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-surface-1 via-surface-base to-surface-2 opacity-50" />
      
      {/* Sticky header */}
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
      
      {/* Main content area - mobile first stacking */}
      <main 
        className="relative z-10 pt-20 px-4 pb-24
          sm:px-6 lg:px-8 lg:pb-8 lg:ml-72
          transition-all duration-300 ease-out
          min-h-[calc(100vh-5rem)]"
        style={{
          paddingBottom: isKeyboardVisible ? '0' : undefined
        }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile bottom navigation - elevated and hidden on keyboard */}
      <div className={`fixed bottom-0 left-0 right-0 z-30 transition-transform duration-300 ease-out ${
        isKeyboardVisible ? 'translate-y-full' : 'translate-y-0'
      } lg:hidden`}>
        <MobileNav />
      </div>
      
      {/* Sidebar - only visible on large screens */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
    </div>
  );
}