"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import AppLayout from "@/app/components/layout/AppLayout";
import SettingsHeader from "@/app/components/settings/SettingsHeader";
import SettingsStats from "@/app/components/settings/SettingsStats";
import SettingsSearch from "@/app/components/settings/SettingsSearch";
import SettingsSection from "@/app/components/settings/SettingsSection";
import FavoriteSettings from "@/app/components/settings/FavoriteSettings";
import RecentSettings from "@/app/components/settings/RecentSettings";
import { visibleSettingsCatalog } from "@/src/data/settingsCatalog";
import { useAuth } from "@/src/hooks/useAuth";
import { useSettingsFavorites } from "@/src/hooks/useSettingsFavorites";
import { useRecentSettings } from "@/src/hooks/useRecentSettings";
import type { SettingItem } from "@/src/types/settings";

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { favorites, toggleFavorite, isFavorite } = useSettingsFavorites();
  const { recent, addRecent } = useRecentSettings();
  const [search, setSearch] = useState("");

  // Fase 6.24: sólo lo que el registro permite mostrar; favoritos y
  // recientes de pantallas ocultas desaparecen.
  const catalog = useMemo(() => visibleSettingsCatalog(), []);
  const allItems = useMemo(() => catalog.flatMap((category) => category.items), [catalog]);
  const findItem = (id: string): SettingItem | undefined => allItems.find((item) => item.id === id);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) return catalog;

    return catalog
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.title.toLowerCase().includes(normalizedSearch) ||
            item.description.toLowerCase().includes(normalizedSearch)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [catalog, normalizedSearch]);

  const favoriteItems = useMemo(
    () => allItems.filter((item) => favorites.includes(item.id)),
    [allItems, favorites]
  );

  const hasResults = filteredCategories.some((category) => category.items.length > 0);

  const handleNavigate = (item: SettingItem) => {
    if (item.status === "coming-soon") return;
    addRecent(item.id, user?.name ?? "Usuario");
    router.push(item.href);
  };

  return (
    <AppLayout>
      <div className="min-h-screen rounded-lg bg-slate-50 p-3">
        <SettingsHeader />
        <SettingsStats />
        <SettingsSearch value={search} onChange={setSearch} />

        {!normalizedSearch && (
          <FavoriteSettings
            items={favoriteItems}
            onToggleFavorite={toggleFavorite}
            onNavigate={handleNavigate}
          />
        )}

        {!hasResults ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-16 text-center shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50">
              <SearchX className="h-7 w-7 text-blue-400" />
            </div>
            <p className="font-semibold text-slate-900">
              No se encontraron configuraciones para &ldquo;{search}&rdquo;
            </p>
            <p className="text-sm text-slate-500">Intenta con otro término de búsqueda.</p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <SettingsSection
              key={category.id}
              label={category.label}
              items={category.items}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
              onNavigate={handleNavigate}
            />
          ))
        )}

        <RecentSettings entries={recent} findItem={findItem} onNavigate={handleNavigate} />
      </div>
    </AppLayout>
  );
}
