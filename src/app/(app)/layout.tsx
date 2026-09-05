import Link from "next/link";
import { logout } from "@/app/actions";
import { NavLinks } from "@/components/NavLinks";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-white/70 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/70">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <span className="text-2xl">⚽📜</span>
            <span className="bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
              Il Muro del Pianto
            </span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
            <NavLinks />
            <form action={logout}>
              <button
                type="submit"
                className="rounded-full px-3.5 py-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-600"
              >
                Esci
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
      <footer className="py-6 text-center text-xs text-zinc-400">
        Fatto con cattiveria per la lega. Nessun fantallenatore è stato risparmiato.
      </footer>
    </div>
  );
}
