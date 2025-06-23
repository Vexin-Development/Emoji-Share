import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

const toasts: Toast[] = [];
let toastIdCounter = 0;
const listeners: Set<(toasts: Toast[]) => void> = new Set();

const addToast = (toast: Omit<Toast, "id">) => {
  const id = (++toastIdCounter).toString();
  const newToast: Toast = { id, ...toast };
  toasts.push(newToast);
  
  listeners.forEach((listener) => listener([...toasts]));
  
  if (toast.duration !== 0) {
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }
  
  return id;
};

const removeToast = (id: string) => {
  const index = toasts.findIndex((toast) => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    listeners.forEach((listener) => listener([...toasts]));
  }
};

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([...toasts]);

  const toast = useCallback((props: Omit<Toast, "id">) => {
    return addToast(props);
  }, []);

  const dismiss = useCallback((id?: string) => {
    if (id) {
      removeToast(id);
    } else {
      toasts.splice(0, toasts.length);
      listeners.forEach((listener) => listener([]));
    }
  }, []);

  // Subscribe to toast updates
  useState(() => {
    const listener = (newToasts: Toast[]) => setToastList(newToasts);
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  });

  return {
    toast,
    dismiss,
    toasts: toastList,
  };
}
