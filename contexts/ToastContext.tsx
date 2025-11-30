import React, { createContext, useContext, useState, useCallback } from 'react';
import { Toast, ToastType } from '../types';
import { v4 as uuidv4 } from 'uuid'; // Assuming uuid is available or use simpler ID gen

interface ToastContextType {
  toasts: Toast[];
  /**
   * Triggers a new toast notification.
   * @param type - success, error, warning, info
   * @param message - Main text
   * @param title - Optional title
   * @param duration - Auto-close duration in ms
   */
  addToast: (type: ToastType, message: string, title?: string, duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provides a global system for displaying temporary notification messages (Toasts).
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, title?: string, duration = 5000) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    const newToast: Toast = { id, type, message, title, duration };
    
    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};