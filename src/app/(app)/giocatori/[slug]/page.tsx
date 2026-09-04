import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SonettoCard } from "@/components/SonettoCard";

export const dynamic = "force-dynamic";

export default async function ProfiloGiocatore({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const giocatore = await prisma.player.findUnique({ where: { slug } });
  if (!giocatore) notFound();

  const [ricevuti, scritti] = await Promise.all([
    prisma.sonetto.findMany({
      where: { bersaglioId: giocatore.id },
      orderBy: { createdAt: "desc" },
      include: {
        autore: { select: { name: true, slug: true, emoji: true } },
        bersaglio: { select: { name: true, slug: true, emoji: true } },
        reazioni: { select: { tipo: true } },
      },
    }),
    prisma.sonetto.findMany({
      where: { autoreId: giocatore.id },
      orderBy: { createdAt: "desc" },
      include: {
        autore: { select: { name: true, slug: true, emoji: true } },
        bersaglio: { select: { name: true, slug: true, emoji: true } },
        reazioni: { select: { tipo: true } },
      },
    }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center gap-4 rounded-2xl border border-emerald-900/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <span className="text-5xl">{giocatore.emoji}</span>
        <div>
          <h1 className="font-hand text-3xl font-bold">{giocatore.name}</h1>
          {giocatore.team && <p className="text-sm text-zinc-500">{giocatore.team}</p>}
        </div>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-red-700 dark:text-red-400">
          Sonetti ricevuti ({ricevuti.length})
        </h2>
        <div className="flex flex-col gap-4">
          {ricevuti.length === 0 ? (
            <p className="text-sm text-zinc-500">Per ora nessuno lo ha preso di mira. Bravo?</p>
          ) : (
            ricevuti.map((s) => <SonettoCard key={s.id} sonetto={s} />)
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-emerald-800 dark:text-emerald-300">
          Sonetti scritti ({scritti.length})
        </h2>
        <div className="flex flex-col gap-4">
          {scritti.length === 0 ? (
            <p className="text-sm text-zinc-500">Non ha ancora impugnato la penna.</p>
          ) : (
            scritti.map((s) => <SonettoCard key={s.id} sonetto={s} />)
          )}
        </div>
      </section>
    </div>
  );
}
