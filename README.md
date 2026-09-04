# Il Muro del Pianto ⚽📜

Il sito della lega dove ognuno scrive sonetti, rime o versi liberi per prendere in giro gli altri fantallenatori. Bacheca dei sonetti, classifica dei più "apprezzati", pagina profilo per ogni giocatore (sonetti scritti e ricevuti), tutto protetto da una password condivisa della lega.

Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma + Postgres.

## Sviluppo locale

1. Installa le dipendenze:

   ```bash
   npm install
   ```

2. Copia `.env.example` in `.env` e `.env.local` e compila i valori:

   ```bash
   cp .env.example .env
   cp .env.example .env.local
   ```

   - `SITE_PASSWORD`: la password che il gruppo userà per entrare nel sito.
   - `DATABASE_URL`: stringa di connessione a un database Postgres (vedi sotto per una versione locale o cloud gratuita).

   `.env` serve alla CLI di Prisma (`db:push`, `db:seed`), `.env.local` serve a Next.js in sviluppo.

3. Modifica `prisma/seed.ts` con i nomi reali dei giocatori della tua lega.

4. Crea le tabelle nel database e popola i giocatori:

   ```bash
   npm run db:push
   npm run db:seed
   ```

5. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

   Apri [http://localhost:3000](http://localhost:3000): ti verrà chiesta la password impostata in `SITE_PASSWORD`.

### Database locale rapido

Se hai Postgres installato in locale:

```bash
createdb murodelpianto
# DATABASE_URL=postgresql://<user>@localhost:5432/murodelpianto
```

In alternativa puoi usare un database Postgres gratuito in cloud (consigliato, così è già pronto per Vercel): [Neon](https://neon.tech), [Supabase](https://supabase.com) o il componente Postgres integrato di Vercel.

## Deploy su Vercel

1. Crea un database Postgres:
   - Nella dashboard del progetto Vercel vai su **Storage → Create Database → Postgres** (basato su Neon), oppure crea un database gratuito su [neon.tech](https://neon.tech) o [supabase.com](https://supabase.com).
   - Copia la connection string.

2. Importa il repository su Vercel ([vercel.com/new](https://vercel.com/new)).

3. Nelle **Environment Variables** del progetto Vercel aggiungi:
   - `DATABASE_URL` = la connection string del database (assicurati che includa `?sslmode=require` se richiesto dal provider).
   - `SITE_PASSWORD` = la password che vuoi usare per il gruppo.

4. Al primo deploy le tabelle non esistono ancora. Da locale, puntando `DATABASE_URL` (nel tuo `.env`) allo stesso database di produzione, esegui una volta:

   ```bash
   npm run db:push
   npm run db:seed
   ```

   (`db:seed` crea i giocatori definiti in `prisma/seed.ts` — modificalo prima con i nomi veri della lega.)

5. Fai il deploy. Ad ogni build Vercel esegue automaticamente `prisma generate` (script `postinstall`).

Per aggiungere o modificare i giocatori in seguito, puoi rieseguire `db:seed` (aggiorna solo chi manca, non duplica) oppure usare `npm run db:studio` per un'interfaccia grafica sul database.

## Struttura del sito

- **Bacheca** (`/`) — feed di tutti i sonetti, ordinati dal più recente, con reazioni 🔥 💀 👏.
- **Scrivi un sonetto** (`/nuovo`) — form per pubblicare un nuovo sonetto: autore, bersaglio (opzionale), titolo e testo.
- **Classifica** (`/classifica`) — sonetti più apprezzati, poeti più prolifici, vittime designate.
- **Profilo giocatore** (`/giocatori/[slug]`) — sonetti scritti e ricevuti da un singolo giocatore.
- **Login** (`/login`) — schermata con la password condivisa della lega; una volta autenticati, l'accesso resta valido per 90 giorni (cookie).

Non c'è un login individuale per persona: chiunque conosca la password del gruppo può scrivere sonetti "a nome di" chiunque sia in lega (selezionandolo da un menu a tendina). È una scelta voluta per restare semplice, dato il contesto informale.
