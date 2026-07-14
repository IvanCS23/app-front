"use client";

import { Search, X } from "lucide-react";

type SettingsSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SettingsSearch({ value, onChange }: SettingsSearchProps) {
  return (
    <div className="relative mb-6 max-w-md">
      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar configuración..."
        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-[13px] text-slate-700 placeholder:text-slate-400 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/15 hover:border-slate-300"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
