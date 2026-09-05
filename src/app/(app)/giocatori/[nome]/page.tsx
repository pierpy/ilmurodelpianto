import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SonettoCard } from "@/components/SonettoCard";
import { NOME_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function ProfiloGiocatore({
  params,
}: {
  params: Promise<{ nome: string }>;
}) {
  const { nome: nomeParam } = await params;
  const nome = decodeURIComponent(nomeParam);

  const [ricevuti, scritti, cookieStore] = await Promise.all([
    prisma.sonetto.findMany({
      where: { bersaglio: { equals: nome, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      include: {
        reazioni: { select: { tipo: true } },
        commenti: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.sonetto.findMany({
      where: { autore: { equals: nome, mode: "insensitive" } },
      orderBy: { createdAt: "desc" },
      include: {
        reazioni: { select: { tipo: true } },
        commenti: { orderBy: { createdAt: "asc" } },
      },
    }),
    cookies(),
  ]);
  const nomeSalvato = cookieStore.get(NOME_COOKIE_NAME)?.value;

  if (ricevuti.length === 0 && scritti.length === 0) notFound();

  return (
    <div className="flex flex-col gap-8">
      <header className="entrata flex items-center gap-4 rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-emerald-700 to-teal-600 p-6 text-white shadow-lg shadow-emerald-900/20">
        <span className="text-4xl">⚽</span>
        <h1 className="font-hand text-4xl font-bold drop-shadow-sm">{nome}</h1>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-red-700 dark:text-red-400">
          Sonetti ricevuti ({ricevuti.length})
        </h2>
        <div className="flex flex-col gap-4">
          {ricevuti.length === 0 ? (
            <p className="text-sm text-zinc-500">Per ora nessuno lo ha preso di mira. Bravo?</p>
          ) : (
            ricevuti.map((s) => <SonettoCard key={s.id} sonetto={s} nomeSalvato={nomeSalvato} />)
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
            scritti.map((s) => <SonettoCard key={s.id} sonetto={s} nomeSalvato={nomeSalvato} />)
          )}
        </div>
      </section>
    </div>
  );
}
