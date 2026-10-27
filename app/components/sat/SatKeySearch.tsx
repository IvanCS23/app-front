"use client";

import { useEffect, useId, useState } from "react";
import { Loader2 } from "lucide-react";

export interface SatKeyOption {
  code: string;
  label: string;
}

type SatKeySearchProps = {
  label: string;
  value: string;
  onChange: (code: string) => void;
  /** Debe ser estable (definida fuera del componente): se usa en un efecto. */
  search: (query: string, signal: AbortSignal) => Promise<SatKeyOption[]>;
  placeholder?: string;
  maxLength?: number;
  normalize?: (value: string) => string;
  error?: string;
  disabled?: boolean;
  className?: string;
};

const SEARCH_DELAY_MS = 300;
const MIN_QUERY_LENGTH = 2;

/**
 * Fase 6.26: clave del SAT (producto o unidad) con búsqueda en el catálogo
 * local del backend mientras se escribe. El valor guardado es siempre la
 * clave; el backend vuelve a validarla al guardar.
 */
export default function SatKeySearch({
  label,
  value,
  onChange,
  search,
  placeholder,
  maxLength,
  normalize = (text) => text,
  error,
  disabled = false,
  className = "",
}: SatKeySearchProps) {
  const listId = useId();
  const [searching, setSearching] = useState(false);
  const [options, setOptions] = useState<SatKeyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<SatKeyOption | null>(null);

  useEffect(() => {
    const query = value.trim();
    if (!searching || query.length < MIN_QUERY_LENGTH) return;

    const controller = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setFailed(false);
      search(query, controller.signal)
        .then(setOptions)
        .catch(() => {
          if (!controller.signal.aborted) {
            setOptions([]);
            setFailed(true);
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, SEARCH_DELAY_MS);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [value, searching, search]);

  const handleInput = (text: string) => {
    const next = normalize(text);
    onChange(next);
    setSelected(null);
    setSearching(true);
    if (next.trim().length < MIN_QUERY_LENGTH) setOptions([]);
  };

  const pick = (option: SatKeyOption) => {
    onChange(option.code);
    setSelected(option);
    setSearching(false);
    setOptions([]);
  };

  const showList = searching && value.trim().length >= MIN_QUERY_LENGTH && !loading;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          type="text"
          aria-label={label}
          aria-invalid={Boolean(error)}
          aria-controls={listId}
          value={value}
          onChange={(event) => handleInput(event.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          autoComplete="off"
          className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 pr-10 text-sm text-[#0F172A] placeholder:text-[#64748B] shadow-sm transition-colors duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
        {loading && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-blue-500" aria-label="Buscando" />}
      </div>

      {showList && (
        <ul id={listId} aria-label={`Resultados de ${label}`} className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-[#E2E8F0] bg-white text-sm shadow-lg">
          {options.length === 0 ? (
            <li className="px-4 py-3 text-[#64748B]">
              {failed ? "No fue posible buscar en el catálogo del SAT." : "Sin coincidencias en el catálogo del SAT."}
            </li>
          ) : (
            options.map((option) => (
              <li key={option.code}>
                <button type="button" onClick={() => pick(option)} className="w-full px-4 py-2 text-left hover:bg-blue-50">
                  <span className="font-mono font-semibold text-blue-700">{option.code}</span> — {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}

      {selected && <p className="mt-1 text-xs text-emerald-700">{selected.code} — {selected.label}</p>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
