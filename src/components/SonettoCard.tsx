import Link from "next/link";
import { ReactionButtons } from "@/components/ReactionButtons";
import { createCommento, type TipoReazione } from "@/app/actions";

type SonettoConDati = {
  id: string;
  titolo: string;
  testo: string;
  createdAt: Date;
  autore: string;
  bersaglio: string | null;
  reazioni: { tipo: string }[];
  commenti: { id: string; autore: string; testo: string; createdAt: Date }[];
};

function contaReazioni(reazioni: { tipo: string }[]): Record<TipoReazione, number> {
  const conteggi: Record<TipoReazione, number> = { fuoco: 0, morto: 0, applauso: 0 };
  for (const r of reazioni) {
    if (r.tipo in conteggi) conteggi[r.tipo as TipoReazione]++;
  }
  return conteggi;
}

function linkWhatsapp(sonetto: SonettoConDati) {
  const righe = [
    `📜 *${sonetto.titolo}*`,
    `di ${sonetto.autore}${sonetto.bersaglio ? ` contro ${sonetto.bersaglio}` : ""}`,
    "",
    sonetto.testo,
    "",
    "— dal Muro del Pianto ⚽",
  ];
  return `https://wa.me/?text=${encodeURIComponent(righe.join("\n"))}`;
}

export function SonettoCard({
  sonetto,
  nomeSalvato,
}: {
  sonetto: SonettoConDati;
  nomeSalvato?: string;
}) {
  return (
    <article className="entrata group relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white shadow-sm ring-1 ring-black/[0.02] transition-all hover:-translate-y-0.5 hover:shadow-lg dark:border-white/10 dark:bg-zinc-900">
      <div
        className={`h-1.5 w-full ${
          sonetto.bersaglio
            ? "bg-gradient-to-r from-red-500 to-orange-400"
            : "bg-gradient-to-r from-emerald-600 to-teal-400"
        }`}
      />

      <div className="p-6">
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

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <ReactionButtons sonettoId={sonetto.id} conteggi={contaReazioni(sonetto.reazioni)} />
          <a
            href={linkWhatsapp(sonetto)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-500/15 active:scale-90 dark:text-emerald-300"
          >
            <span>📤</span>
            <span>WhatsApp</span>
          </a>
        </div>

        <div className="mt-5 border-t border-emerald-900/10 pt-4 dark:border-white/10">
          {sonetto.commenti.length > 0 && (
            <ul className="mb-3 flex flex-col gap-2">
              {sonetto.commenti.map((c) => (
                <li
                  key={c.id}
                  className="rounded-2xl rounded-tl-sm bg-emerald-900/5 px-3.5 py-2 text-sm dark:bg-white/5"
                >
                  <span className="font-medium text-emerald-800 dark:text-emerald-300">
                    {c.autore}
                  </span>
                  <span className="text-zinc-500">: </span>
                  <span className="text-zinc-700 dark:text-zinc-300">{c.testo}</span>
                </li>
              ))}
            </ul>
          )}

          <form action={createCommento} className="flex flex-wrap gap-2">
            <input type="hidden" name="sonettoId" value={sonetto.id} />
            <input
              type="text"
              name="autore"
              required
              defaultValue={nomeSalvato}
              placeholder="Il tuo nome"
              className="w-32 flex-none rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none transition-shadow focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <input
              type="text"
              name="testo"
              required
              placeholder="Scrivi un commento…"
              className="min-w-0 flex-1 rounded-full border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none transition-shadow focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-800"
            />
            <button
              type="submit"
              className="flex-none rounded-full bg-emerald-700 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-800 active:scale-95"
            >
              Commenta
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}
