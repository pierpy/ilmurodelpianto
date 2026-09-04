import Link from "next/link";
import { ReactionButtons } from "@/components/ReactionButtons";
import type { TipoReazione } from "@/app/actions";

type SonettoConDati = {
  id: string;
  titolo: string;
  testo: string;
  createdAt: Date;
  autore: string;
  bersaglio: string | null;
  reazioni: { tipo: string }[];
};

function contaReazioni(reazioni: { tipo: string }[]): Record<TipoReazione, number> {
  const conteggi: Record<TipoReazione, number> = { fuoco: 0, morto: 0, applauso: 0 };
  for (const r of reazioni) {
    if (r.tipo in conteggi) conteggi[r.tipo as TipoReazione]++;
  }
  return conteggi;
}

export function SonettoCard({ sonetto }: { sonetto: SonettoConDati }) {
  return (
    <article className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <header className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="font-hand text-2xl font-bold text-emerald-950 dark:text-emerald-100">
          {sonetto.titolo}
        </h2>
        <time className="text-xs text-zinc-400">
          {new Intl.DateTimeFormat("it-IT", { dateStyle: "medium", timeStyle: "short" }).format(
            sonetto.createdAt,
          )}
        </time>
      </header>

      <p className="mb-4 text-sm text-zinc-500">
        di{" "}
        <Link
          href={`/giocatori/${encodeURIComponent(sonetto.autore)}`}
          className="font-medium text-emerald-800 hover:underline dark:text-emerald-300"
        >
          {sonetto.autore}
        </Link>
        {sonetto.bersaglio && (
          <>
            {" "}
            contro{" "}
            <Link
              href={`/giocatori/${encodeURIComponent(sonetto.bersaglio)}`}
              className="font-medium text-red-700 hover:underline dark:text-red-400"
            >
              {sonetto.bersaglio}
            </Link>
          </>
        )}
      </p>

      <p className="whitespace-pre-wrap font-serif text-lg leading-relaxed text-zinc-800 dark:text-zinc-200">
        {sonetto.testo}
      </p>

      <div className="mt-5">
        <ReactionButtons sonettoId={sonetto.id} conteggi={contaReazioni(sonetto.reazioni)} />
      </div>
    </article>
  );
}
