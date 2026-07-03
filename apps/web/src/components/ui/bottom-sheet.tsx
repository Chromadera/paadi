"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative w-full max-w-sm bg-bg rounded-t-3xl border-t-7 border-x-7 border-ink/8 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] animate-in slide-in-from-bottom duration-300 ease-out"
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-ink/15" />
        </div>

        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-3 border-b border-ink/6">
            <span className="text-sm font-black text-ink tracking-tight">{title}</span>
            <button
              onClick={onClose}
              className="flex items-center justify-center h-7 w-7 rounded-xl bg-ink/5 text-ink/50 hover:text-ink active:scale-90 transition-all"
            >
              <X className="h-4 w-4 stroke-2" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-4 pb-16 pt-2 max-h-[70vh] overflow-y-auto scrollbar-none">
          {children}
        </div>
      </div>
    </div>
  );
}