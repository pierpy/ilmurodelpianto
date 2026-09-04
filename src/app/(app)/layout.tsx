import Link from "next/link";
import { logout } from "@/app/actions";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-emerald-900/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
            <span>⚽📜</span>
            <span>Il Muro del Pianto</span>
          </Link>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
            <Link href="/" className="rounded-lg px-3 py-1.5 hover:bg-emerald-900/5 dark:hover:bg-white/10">
              Bacheca
            </Link>
            <Link href="/nuovo" className="rounded-lg px-3 py-1.5 hover:bg-emerald-900/5 dark:hover:bg-white/10">
              Scrivi un sonetto
            </Link>
            <Link href="/classifica" className="rounded-lg px-3 py-1.5 hover:bg-emerald-900/5 dark:hover:bg-white/10">
              Classifica
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg px-3 py-1.5 text-zinc-500 hover:bg-emerald-900/5 hover:text-red-600 dark:hover:bg-white/10"
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
