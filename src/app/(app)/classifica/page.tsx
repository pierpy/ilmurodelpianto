import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function Podio({
  titolo,
  emoji,
  righe,
}: {
  titolo: string;
  emoji: string;
  righe: { nome: string; label: string; valore: number; unita: string }[];
}) {
  return (
    <section className="rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <h2 className="mb-4 flex items-center gap-2 font-hand text-2xl font-bold">
        <span>{emoji}</span>
        {titolo}
      </h2>
      {righe.length === 0 ? (
        <p className="text-sm text-zinc-500">Ancora nessun dato.</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {righe.map((r, i) => (
            <li key={r.nome} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-5 text-center text-zinc-400">{i + 1}.</span>
                <Link href={`/giocatori/${encodeURIComponent(r.nome)}`} className="font-medium hover:underline">
                  {r.label}
                </Link>
              </span>
              <span className="tabular-nums text-zinc-500">
                {r.valore} {r.unita}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export default async function Classifica() {
  const [sonetti, autoriGroup, vittimeGroup] = await Promise.all([
    prisma.sonetto.findMany({ include: { reazioni: true } }),
    prisma.sonetto.groupBy({ by: ["autore"], _count: { autore: true } }),
    prisma.sonetto.groupBy({
      by: ["bersaglio"],
      _count: { bersaglio: true },
      where: { bersaglio: { not: null } },
    }),
  ]);

  const topSonetti = sonetti
    .map((s) => ({ ...s, totaleReazioni: s.reazioni.length }))
    .sort((a, b) => b.totaleReazioni - a.totaleReazioni)
    .slice(0, 5)
    .filter((s) => s.totaleReazioni > 0)
    .map((s) => ({
      nome: s.autore,
      label: `${s.titolo} (${s.autore})`,
      valore: s.totaleReazioni,
      unita: "reazioni",
    }));

  const topAutori = autoriGroup
    .sort((a, b) => b._count.autore - a._count.autore)
    .slice(0, 5)
    .map((g) => ({
      nome: g.autore,
      label: g.autore,
      valore: g._count.autore,
      unita: "sonetti scritti",
    }));

  const topVittime = vittimeGroup
    .filter((g): g is typeof g & { bersaglio: string } => g.bersaglio !== null)
    .sort((a, b) => b._count.bersaglio - a._count.bersaglio)
    .slice(0, 5)
    .map((g) => ({
      nome: g.bersaglio,
      label: g.bersaglio,
      valore: g._count.bersaglio,
      unita: "sonetti ricevuti",
    }));

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-hand text-3xl font-bold">Classifica del muro</h1>
      <Podio titolo="Sonetti più apprezzati" emoji="🏆" righe={topSonetti} />
      <Podio titolo="Poeti più prolifici" emoji="✍️" righe={topAutori} />
      <Podio titolo="Vittime designate" emoji="🎯" righe={topVittime} />
    </div>
  );
}
