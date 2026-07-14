import { Star } from "lucide-react";
import SettingCard from "@/app/components/settings/SettingCard";
import type { SettingItem } from "@/src/types/settings";

type FavoriteSettingsProps = {
  items: SettingItem[];
  onToggleFavorite: (id: string) => void;
  onNavigate: (item: SettingItem) => void;
};

export default function FavoriteSettings({
  items,
  onToggleFavorite,
  onNavigate,
}: FavoriteSettingsProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-500">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        Favoritos
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <SettingCard
            key={item.id}
            item={item}
            isFavorite
            onToggleFavorite={onToggleFavorite}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
