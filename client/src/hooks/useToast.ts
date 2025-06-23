import { useState, useCallback, useEffect } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

// Global toast state
const toasts: Toast[] = [];
let toastIdCounter = 0;
const listeners = new Set<(toasts: Toast[]) => void>();

const addToast = (toast: Omit<Toast, "id">) => {
  const id = (++toastIdCounter).toString();
  const newToast: Toast = { id, ...toast };
  toasts.push(newToast);
  
  // Notify all listeners
  listeners.forEach((listener) => listener([...toasts]));
  
  // Auto-remove toast after duration (default 5 seconds)
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
    // Notify all listeners
    listeners.forEach((listener) => listener([...toasts]));
  }
};

export function useToast() {
  const [toastList, setToastList] = useState<Toast[]>([...toasts]);

  // Subscribe to toast updates
  useEffect(() => {
    const listener = (newToasts: Toast[]) => setToastList([...newToasts]);
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, []);

  const toast = useCallback((props: Omit<Toast, "id">) => {
    return addToast(props);
  }, []);

  const dismiss = useCallback((id?: string) => {
    if (id) {
      removeToast(id);
    } else {
      // Dismiss all toasts
      toasts.splice(0, toasts.length);
      listeners.forEach((listener) => listener([]));
    }
  }, []);

  return {
    toast,
    dismiss,
    toasts: toastList,
  };
}
