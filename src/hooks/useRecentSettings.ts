"use client";

import { useCallback, useEffect, useState } from "react";
import type { RecentSettingEntry } from "@/src/types/settings";

const STORAGE_KEY = "settings_recent";
const MAX_RECENT = 5;

function readRecent(): RecentSettingEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentSettingEntry[]) : [];
  } catch {
    return [];
  }
}

export function useRecentSettings() {
  const [recent, setRecent] = useState<RecentSettingEntry[]>([]);

  useEffect(() => {
    setRecent(readRecent());
  }, []);

  const addRecent = useCallback((id: string, userName: string) => {
    setRecent((prev) => {
      const withoutId = prev.filter((entry) => entry.id !== id);
      const next = [{ id, visitedAt: new Date().toISOString(), userName }, ...withoutId].slice(
        0,
        MAX_RECENT
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { recent, addRecent };
}
