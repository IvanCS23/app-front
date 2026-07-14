import type { LucideIcon } from "lucide-react";

export type SettingItemStatus = "available" | "coming-soon";

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
