import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";

const ESTENSIONI_VALIDE = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);
const NUMERO_RIQUADRI = 48;

async function getFotoSfondo() {
  const dir = path.join(process.cwd(), "public", "sfondo");
  try {
    const file = await fs.readdir(dir);
    return file.filter((f) => ESTENSIONI_VALIDE.has(path.extname(f).toLowerCase())).sort();
  } catch {
    return [];
  }
}

export async function PhotoBackground() {
  const foto = await getFotoSfondo();
  if (foto.length === 0) return null;

  const riquadri = Array.from({ length: NUMERO_RIQUADRI }, (_, i) => foto[i % foto.length]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="grid grid-cols-4 gap-1 sm:grid-cols-6 md:grid-cols-8">
        {riquadri.map((nome, i) => (
          <div
            key={i}
            className="relative aspect-square w-full overflow-hidden"
            style={{ transform: `rotate(${((i * 7) % 11) - 5}deg) scale(1.15)` }}
          >
            <Image src={`/sfondo/${nome}`} alt="" fill sizes="200px" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-emerald-50/60 dark:bg-zinc-950/70" />
    </div>
  );
}
