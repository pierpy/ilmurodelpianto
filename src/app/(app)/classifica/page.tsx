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
  righe: { slug: string; label: string; valore: number; unita: string }[];
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
            <li key={r.slug} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex items-center gap-2">
                <span className="w-5 text-center text-zinc-400">{i + 1}.</span>
                <Link href={`/giocatori/${r.slug}`} className="font-medium hover:underline">
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
  const [sonettiPiuReazionati, autoriGroup, vittimeGroup, giocatori] = await Promise.all([
    prisma.sonetto.findMany({
      include: {
        autore: { select: { name: true, slug: true, emoji: true } },
        reazioni: true,
      },
    }),
    prisma.sonetto.groupBy({ by: ["autoreId"], _count: { autoreId: true } }),
    prisma.sonetto.groupBy({
      by: ["bersaglioId"],
      _count: { bersaglioId: true },
      where: { bersaglioId: { not: null } },
    }),
    prisma.player.findMany(),
  ]);

  const giocatoriById = new Map(giocatori.map((g) => [g.id, g]));

  const topSonetti = sonettiPiuReazionati
    .map((s) => ({ ...s, totaleReazioni: s.reazioni.length }))
    .sort((a, b) => b.totaleReazioni - a.totaleReazioni)
    .slice(0, 5)
    .filter((s) => s.totaleReazioni > 0)
    .map((s) => ({
      slug: s.autore.slug,
      label: `${s.titolo} (${s.autore.name})`,
      valore: s.totaleReazioni,
      unita: "reazioni",
    }));

  const topAutori = autoriGroup
    .map((g) => ({ giocatore: giocatoriById.get(g.autoreId), count: g._count.autoreId }))
    .filter((g) => g.giocatore)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((g) => ({
      slug: g.giocatore!.slug,
      label: `${g.giocatore!.emoji} ${g.giocatore!.name}`,
      valore: g.count,
      unita: "sonetti scritti",
    }));

  const topVittime = vittimeGroup
    .map((g) => ({
      giocatore: g.bersaglioId ? giocatoriById.get(g.bersaglioId) : undefined,
      count: g._count.bersaglioId,
    }))
    .filter((g) => g.giocatore)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((g) => ({
      slug: g.giocatore!.slug,
      label: `${g.giocatore!.emoji} ${g.giocatore!.name}`,
      valore: g.count,
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
