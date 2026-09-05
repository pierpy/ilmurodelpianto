import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSonetto } from "@/app/actions";
import { NOME_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CAMPO =
  "w-full rounded-xl border border-zinc-300 bg-white px-3.5 py-2.5 outline-none transition-shadow focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-800";

async function getNomiConosciuti() {
  const [autori, bersagli] = await Promise.all([
    prisma.sonetto.findMany({ distinct: ["autore"], select: { autore: true } }),
    prisma.sonetto.findMany({
      where: { bersaglio: { not: null } },
      distinct: ["bersaglio"],
      select: { bersaglio: true },
    }),
  ]);
  const nomi = new Set<string>();
  for (const a of autori) nomi.add(a.autore);
  for (const b of bersagli) if (b.bersaglio) nomi.add(b.bersaglio);
  return Array.from(nomi).sort((a, b) => a.localeCompare(b));
}

export default async function NuovoSonetto() {
  const [nomiConosciuti, cookieStore] = await Promise.all([getNomiConosciuti(), cookies()]);
  const nomeSalvato = cookieStore.get(NOME_COOKIE_NAME)?.value ?? "";

  return (
    <form
      action={createSonetto}
      className="entrata flex flex-col gap-5 rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8 dark:border-white/10 dark:bg-zinc-900"
    >
      <div>
        <h1 className="font-hand text-4xl font-bold text-emerald-950 dark:text-emerald-100">
          Scrivi un sonetto
        </h1>
        <p className="text-sm text-zinc-500">
          Rime, terzine o versi liberi: l&apos;importante è far ridere (e un po&apos; soffrire).
        </p>
      </div>

      <datalist id="nomi-conosciuti">
        {nomiConosciuti.map((nome) => (
          <option key={nome} value={nome} />
        ))}
      </datalist>

      <div>
        <label className="mb-1 block text-sm font-medium">Il tuo nome</label>
        <input
          type="text"
          name="autore"
          required
          list="nomi-conosciuti"
          defaultValue={nomeSalvato}
          placeholder="Come ti firmi?"
          className={CAMPO}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Contro chi? (opzionale)</label>
        <input
          type="text"
          name="bersaglio"
          list="nomi-conosciuti"
          placeholder="Nessuno in particolare / lega intera"
          className={CAMPO}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Titolo</label>
        <input
          type="text"
          name="titolo"
          required
          placeholder="Es: Ballata del portiere bucato"
          className={CAMPO}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Il sonetto</label>
        <textarea
          name="testo"
          required
          rows={10}
          placeholder={"Nel campionato de la lega nostra,\nun mister c'è che formazioni sbaglia..."}
          className={`${CAMPO} font-hand text-lg leading-relaxed`}
        />
      </div>

      <button
        type="submit"
        className="self-start rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 px-6 py-2.5 font-semibold text-white shadow-md shadow-emerald-900/20 transition-transform hover:scale-105 active:scale-95"
      >
        Pubblica sul muro
      </button>
    </form>
  );
}
