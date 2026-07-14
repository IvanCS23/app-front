import { Clock } from "lucide-react";
import type { RecentSettingEntry, SettingItem } from "@/src/types/settings";

type RecentSettingsProps = {
  entries: RecentSettingEntry[];
  findItem: (id: string) => SettingItem | undefined;
  onNavigate: (item: SettingItem) => void;
};

function formatRelativeDate(value: string): string {
  return new Date(value).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RecentSettings({ entries, findItem, onNavigate }: RecentSettingsProps) {
  const rows = entries
    .map((entry) => ({ entry, item: findItem(entry.id) }))
    .filter((row): row is { entry: RecentSettingEntry; item: SettingItem } => Boolean(row.item));

  if (rows.length === 0) return null;

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-slate-500">
        <Clock className="h-3.5 w-3.5" />
        Configuraciones recientes
      </h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {rows.map(({ entry, item }, index) => {
          const Icon = item.icon;
          return (
            <button
              key={entry.id}
              onClick={() => onNavigate(item)}
              className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-slate-50 ${
                index !== rows.length - 1 ? "border-b border-slate-100" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-slate-900">{item.title}</p>
                <p className="text-[12px] text-slate-500">{entry.userName}</p>
              </div>
              <span className="shrink-0 text-[12px] text-slate-400">
                {formatRelativeDate(entry.visitedAt)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
