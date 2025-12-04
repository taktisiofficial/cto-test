import { useCallback } from "react";

interface Toast {
  id: string;
  title?: string;
  message: string;
  type: "success" | "error" | "info";
}

let toastCallbacks: ((toast: Toast) => void)[] = [];
let removeCallbacks: ((id: string) => void)[] = [];

export function registerToastListener(
  onAdd: (toast: Toast) => void,
  onRemove: (id: string) => void
) {
  toastCallbacks.push(onAdd);
  removeCallbacks.push(onRemove);
  return () => {
    toastCallbacks = toastCallbacks.filter((cb) => cb !== onAdd);
    removeCallbacks = removeCallbacks.filter((cb) => cb !== onRemove);
  };
}

export function useToast() {
  const addToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info", title?: string) => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast = { id, message, type, title };
      toastCallbacks.forEach((cb) => cb(toast));
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    removeCallbacks.forEach((cb) => cb(id));
  }, []);

  return { addToast, removeToast };
}
