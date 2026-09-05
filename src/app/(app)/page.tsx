import Link from "next/link";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SonettoCard } from "@/components/SonettoCard";
import { NOME_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

function Hero({ numero }: { numero: number }) {
  return (
    <div className="entrata mb-2 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-emerald-900/10 bg-gradient-to-br from-emerald-700 to-teal-600 px-6 py-7 text-white shadow-lg shadow-emerald-900/20">
      <div>
        <h1 className="font-hand text-4xl font-bold drop-shadow-sm">Il Muro del Pianto</h1>
        <p className="mt-1 text-sm text-emerald-50/90">
          {numero} {numero === 1 ? "sonetto" : "sonetti"} di rime, insulti e prese in giro.
        </p>
      </div>
      <Link
        href="/nuovo"
        className="flex-none rounded-full bg-white px-5 py-2.5 font-semibold text-emerald-800 shadow-md transition-transform hover:scale-105 active:scale-95"
      >
        ✍️ Scrivi un sonetto
      </Link>
    </div>
  );
}

export default async function Bacheca() {
  const [sonetti, cookieStore] = await Promise.all([
    prisma.sonetto.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        reazioni: { select: { tipo: true } },
        commenti: { orderBy: { createdAt: "asc" } },
      },
    }),
    cookies(),
  ]);
  const nomeSalvato = cookieStore.get(NOME_COOKIE_NAME)?.value;

  if (sonetti.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-5xl">🕸️</p>
        <p className="text-lg text-zinc-500">
          Ancora nessun sonetto. Il muro aspetta la sua prima lacrima.
        </p>
        <Link
          href="/nuovo"
          className="rounded-full bg-gradient-to-r from-emerald-700 to-teal-600 px-5 py-2.5 font-semibold text-white shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          Scrivi il primo sonetto
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Hero numero={sonetti.length} />
      {sonetti.map((sonetto) => (
        <SonettoCard key={sonetto.id} sonetto={sonetto} nomeSalvato={nomeSalvato} />
      ))}
    </div>
  );
}
