"use client";

import { useEffect, useState } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

interface ToastProps {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: (id: string) => void;
}

export function Toast({
  id,
  title,
  message,
  type,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 200);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const styles = {
    success: {
      bg: "bg-[var(--success-50)] border-[var(--success-500)]",
      text: "text-[var(--success-700)]",
      icon: "text-[var(--success-600)]",
    },
    error: {
      bg: "bg-[var(--danger-50)] border-[var(--danger-500)]",
      text: "text-[var(--danger-700)]",
      icon: "text-[var(--danger-600)]",
    },
    info: {
      bg: "bg-[var(--info-50)] border-[var(--info-500)]",
      text: "text-[var(--info-700)]",
      icon: "text-[var(--info-600)]",
    },
  }[type];

  const Icon =
    type === "success"
      ? CheckCircle
      : type === "error"
      ? AlertCircle
      : Info;

  return (
    <div
      className={`rounded-[var(--radius-lg)] border-l-4 ${styles.bg} p-4 ${styles.text} flex items-start gap-3 shadow-[var(--shadow-lg)] backdrop-blur-sm transition-all duration-[var(--duration-base)] ease-[var(--ease-out)] ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      role="alert"
      aria-live="polite"
    >
      <Icon className={`h-5 w-5 flex-shrink-0 ${styles.icon} mt-0.5`} />
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm">{message}</p>
      </div>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 200);
        }}
        className="flex-shrink-0 rounded-[var(--radius-sm)] p-1 text-current opacity-60 hover:opacity-100 hover:bg-black/5 transition-all duration-[var(--duration-fast)] ease-[var(--ease-out)] focus-visible:outline-none focus-visible:ring-[var(--focus-ring-width)] focus-visible:ring-[var(--focus-ring-color)] min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Array<ToastProps>;
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = (
    message: string,
    type: "success" | "error" | "info" = "info",
    title?: string
  ) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        type,
        title,
        onClose: () => {},
      },
    ]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, addToast, removeToast };
}
