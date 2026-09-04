"use client";

import { useOptimistic, useTransition } from "react";
import { reagisci, type TipoReazione } from "@/app/actions";

const REAZIONI: { tipo: TipoReazione; emoji: string; label: string }[] = [
  { tipo: "fuoco", emoji: "🔥", label: "Che rima" },
  { tipo: "morto", emoji: "💀", label: "Devastante" },
  { tipo: "applauso", emoji: "👏", label: "Applausi" },
];

export function ReactionButtons({
  sonettoId,
  conteggi,
}: {
  sonettoId: string;
  conteggi: Record<TipoReazione, number>;
}) {
  const [isPending, startTransition] = useTransition();
  const [optimisticConteggi, addOptimistic] = useOptimistic(
    conteggi,
    (state, tipo: TipoReazione) => ({ ...state, [tipo]: (state[tipo] ?? 0) + 1 }),
  );

  return (
    <div className="flex gap-2">
      {REAZIONI.map(({ tipo, emoji, label }) => (
        <button
          key={tipo}
          type="button"
          title={label}
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              addOptimistic(tipo);
              await reagisci(sonettoId, tipo);
            });
          }}
          className="flex items-center gap-1 rounded-full border border-emerald-900/10 bg-white px-3 py-1 text-sm transition-colors hover:bg-emerald-900/5 disabled:opacity-60 dark:border-white/10 dark:bg-zinc-800"
        >
          <span>{emoji}</span>
          <span className="tabular-nums text-zinc-500">{optimisticConteggi[tipo] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
