"use client";

import { useEffect } from "react";
import { CheckCircle2, Info, X } from "lucide-react";

/** "info" (Fase 6.24): aviso neutro, nunca un éxito. */
export type ToastData = { message: string; type: "success" | "error" | "info" };

type ToastProps = ToastData & { onClose: () => void };

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`fixed bottom-4 right-4 z-[100] flex items-center gap-3 rounded-xl px-4 py-3 shadow-lg animate-in slide-in-from-right-5 duration-300 ${
        type === "success" ? "bg-emerald-500 text-white" : type === "info" ? "bg-blue-600 text-white" : "bg-red-500 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : type === "info" ? (
        <Info className="h-5 w-5" />
      ) : (
        <X className="h-5 w-5" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
