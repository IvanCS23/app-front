"use client";

import { ArrowRight, Star } from "lucide-react";
import type { SettingItem } from "@/src/types/settings";

type SettingCardProps = {
  item: SettingItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (item: SettingItem) => void;
};

export default function SettingCard({
  item,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}: SettingCardProps) {
  const { title, description, icon: Icon, status } = item;
  const isComingSoon = status === "coming-soon";

  return (
    <div
      onClick={() => !isComingSoon && onNavigate(item)}
      className={`group relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ${
        isComingSoon
          ? "opacity-60"
          : "cursor-pointer hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item.id);
        }}
        className="absolute right-4 top-4 text-slate-300 transition-colors hover:text-amber-400"
        title={isFavorite ? "Quitar de favoritos" : "Marcar como favorito"}
      >
        <Star className={`h-4 w-4 ${isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
      </button>

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>

      <div className="pr-6">
        <h3 className="text-[15px] font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-500">{description}</p>
      </div>

      <div className="mt-1 flex items-center justify-between">
        {isComingSoon ? (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
            Próximamente
          </span>
        ) : (
          <span />
        )}

        <span
          className={`flex items-center gap-1 text-[13px] font-semibold transition-transform ${
            isComingSoon
              ? "text-slate-400"
              : "text-blue-600 group-hover:translate-x-0.5"
          }`}
        >
          Configurar
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}
