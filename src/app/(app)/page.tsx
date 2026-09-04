import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { SonettoCard } from "@/components/SonettoCard";

export const dynamic = "force-dynamic";

export default async function Bacheca() {
  const sonetti = await prisma.sonetto.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      autore: { select: { name: true, slug: true, emoji: true } },
      bersaglio: { select: { name: true, slug: true, emoji: true } },
      reazioni: { select: { tipo: true } },
    },
  });

  if (sonetti.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <p className="text-5xl">🕸️</p>
        <p className="text-lg text-zinc-500">
          Ancora nessun sonetto. Il muro aspetta la sua prima lacrima.
        </p>
        <Link
          href="/nuovo"
          className="rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
        >
          Scrivi il primo sonetto
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {sonetti.map((sonetto) => (
        <SonettoCard key={sonetto.id} sonetto={sonetto} />
      ))}
    </div>
  );
}
