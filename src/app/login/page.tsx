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
        className="w-full max-w-sm rounded-2xl border border-emerald-900/10 bg-white p-8 shadow-xl shadow-emerald-950/5 dark:border-white/10 dark:bg-zinc-900"
      >
        <div className="mb-6 text-center">
          <div className="text-4xl">⚽📜</div>
          <h1 className="mt-2 font-serif text-2xl font-bold text-emerald-950 dark:text-emerald-100">
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
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-800"
        />

        {error && (
          <p className="mt-2 text-sm text-red-600">Password sbagliata, riprova.</p>
        )}

        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-emerald-800"
        >
          Entra
        </button>
      </form>
    </div>
  );
}
