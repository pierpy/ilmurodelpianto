import { login } from "@/app/actions";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <form
        action={login}
        className="entrata w-full max-w-sm rounded-3xl border border-emerald-900/10 bg-white/90 p-8 shadow-2xl shadow-emerald-950/10 backdrop-blur-sm dark:border-white/10 dark:bg-zinc-900/90"
      >
        <div className="mb-6 text-center">
          <div className="text-5xl drop-shadow-sm">⚽📜</div>
          <h1 className="mt-3 font-hand text-4xl font-bold text-emerald-950 dark:text-emerald-100">
            Il Muro del Pianto
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Inserisci la password della lega per entrare.
          </p>
        </div>

        <input type="hidden" name="next" value={next ?? "/"} />

        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition-shadow focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-800"
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">Password sbagliata, riprova.</p>
        )}

        <label className="mt-4 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Come ti chiami? <span className="font-normal text-zinc-400">(opzionale)</span>
        </label>
        <input
          type="text"
          name="nome"
          placeholder="Così te lo ricordiamo la prossima volta"
          className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2.5 outline-none transition-shadow focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/15 dark:border-zinc-700 dark:bg-zinc-800"
        />

        <button
          type="submit"
          className="mt-6 w-full rounded-xl bg-gradient-to-r from-emerald-700 to-teal-600 px-4 py-2.5 font-semibold text-white shadow-lg shadow-emerald-900/20 transition-transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        >
          Entra
        </button>
      </form>
    </div>
  );
}
