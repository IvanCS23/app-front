import SettingCard from "@/app/components/settings/SettingCard";
import type { SettingItem } from "@/src/types/settings";

type SettingsSectionProps = {
  label: string;
  items: SettingItem[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onNavigate: (item: SettingItem) => void;
};

export default function SettingsSection({
  label,
  items,
  isFavorite,
  onToggleFavorite,
  onNavigate,
}: SettingsSectionProps) {
  if (items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">{label}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <SettingCard
            key={item.id}
            item={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={onToggleFavorite}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </section>
  );
}
