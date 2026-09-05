"use client";

import { useOptimistic, useTransition } from "react";
import { reagisci, type TipoReazione } from "@/app/actions";

const REAZIONI: { tipo: TipoReazione; emoji: string; label: string; colore: string }[] = [
  {
    tipo: "fuoco",
    emoji: "🔥",
    label: "Che rima",
    colore: "border-orange-500/20 bg-orange-500/10 hover:bg-orange-500/15 text-orange-700 dark:text-orange-300",
  },
  {
    tipo: "morto",
    emoji: "💀",
    label: "Devastante",
    colore: "border-violet-500/20 bg-violet-500/10 hover:bg-violet-500/15 text-violet-700 dark:text-violet-300",
  },
  {
    tipo: "applauso",
    emoji: "👏",
    label: "Applausi",
    colore: "border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/15 text-amber-700 dark:text-amber-300",
  },
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
      {REAZIONI.map(({ tipo, emoji, label, colore }) => (
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
          className={`flex items-center gap-1 rounded-full border px-3 py-1 text-sm font-medium transition-all active:scale-90 disabled:opacity-60 ${colore}`}
        >
          <span>{emoji}</span>
          <span className="tabular-nums">{optimisticConteggi[tipo] ?? 0}</span>
        </button>
      ))}
    </div>
  );
}
