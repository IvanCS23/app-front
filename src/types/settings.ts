import type { LucideIcon } from "lucide-react";

/** "demo" (Fase 6.24): maqueta navegable que no guarda nada. */
export type SettingItemStatus = "available" | "coming-soon" | "demo";

export interface SettingItem {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: SettingItemStatus;
}

export interface SettingCategory {
  id: string;
  label: string;
  items: SettingItem[];
}

export interface RecentSettingEntry {
  id: string;
  visitedAt: string;
  userName: string;
}
