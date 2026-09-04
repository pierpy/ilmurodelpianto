import { prisma } from "@/lib/prisma";
import { createSonetto } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function NuovoSonetto() {
  const giocatori = await prisma.player.findMany({ orderBy: { name: "asc" } });

  if (giocatori.length === 0) {
    return (
      <p className="text-zinc-500">
        Non ci sono ancora giocatori in lega. Aggiungili con{" "}
        <code className="rounded bg-black/5 px-1 py-0.5 dark:bg-white/10">npm run db:seed</code> o
        direttamente nel database.
      </p>
    );
  }

  return (
    <form action={createSonetto} className="flex flex-col gap-5">
      <div>
        <h1 className="font-hand text-3xl font-bold">Scrivi un sonetto</h1>
        <p className="text-sm text-zinc-500">
          Rime, terzine o versi liberi: l&apos;importante è far ridere (e un po&apos; soffrire).
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Chi scrive?</label>
        <select
          name="autoreId"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">— seleziona il tuo nome —</option>
          {giocatori.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Contro chi? (opzionale)</label>
        <select
          name="bersaglioId"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        >
          <option value="">Nessuno in particolare / lega intera</option>
          {giocatori.map((g) => (
            <option key={g.id} value={g.id}>
              {g.emoji} {g.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Titolo</label>
        <input
          type="text"
          name="titolo"
          required
          placeholder="Es: Ballata del portiere bucato"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Il sonetto</label>
        <textarea
          name="testo"
          required
          rows={10}
          placeholder={"Nel campionato de la lega nostra,\nun mister c'è che formazioni sbaglia..."}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-hand text-lg leading-relaxed dark:border-zinc-700 dark:bg-zinc-800"
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white hover:bg-emerald-800"
      >
        Pubblica sul muro
      </button>
    </form>
  );
}
