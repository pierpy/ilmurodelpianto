# Il Muro del Pianto ⚽📜

Il sito della lega dove ognuno scrive sonetti, rime o versi liberi per prendere in giro gli altri fantallenatori. Bacheca dei sonetti, classifica dei più "apprezzati", pagina profilo per ogni autore/bersaglio (sonetti scritti e ricevuti), tutto protetto da una password condivisa della lega.

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

   `.env` serve alla CLI di Prisma (`db:push`), `.env.local` serve a Next.js in sviluppo.

3. Crea le tabelle nel database:

   ```bash
   npm run db:push
   ```

4. Avvia il server di sviluppo:

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

1. Crea un database Postgres (es. su [neon.tech](https://neon.tech)) e copia la connection string.

2. Importa il repository su Vercel ([vercel.com/new](https://vercel.com/new)).

3. Nelle **Environment Variables** del progetto Vercel aggiungi:
   - `DATABASE_URL` = la connection string del database (assicurati che includa `?sslmode=require` se richiesto dal provider).
   - `SITE_PASSWORD` = la password che vuoi usare per il gruppo.

4. Al primo deploy le tabelle non esistono ancora. Da locale, puntando `DATABASE_URL` (nel tuo `.env`) allo stesso database di produzione, esegui una volta:

   ```bash
   npm run db:push
   ```

5. Fai il deploy (o un Redeploy se le variabili le hai aggiunte dopo il primo). Ad ogni build Vercel esegue automaticamente `prisma generate` (script `postinstall`).

Puoi ispezionare o modificare a mano i dati con `npm run db:studio` (apre un'interfaccia grafica sul database).

## Struttura del sito

- **Bacheca** (`/`) — feed di tutti i sonetti, ordinati dal più recente, con reazioni 🔥 💀 👏, commenti pubblici e un pulsante per condividere su WhatsApp.
- **Scrivi un sonetto** (`/nuovo`) — form per pubblicare un nuovo sonetto: il tuo nome, il bersaglio (opzionale), titolo e testo. Non c'è una rosa di giocatori da configurare: il nome lo scrivi tu al momento (con suggerimento automatico dei nomi già usati).
- **Classifica** (`/classifica`) — sonetti più apprezzati, poeti più prolifici, vittime designate.
- **Pagina persona** (`/giocatori/[nome]`) — sonetti scritti e ricevuti da chiunque compaia come autore o bersaglio di almeno un sonetto.
- **Login** (`/login`) — schermata con la password condivisa della lega; una volta autenticati, l'accesso resta valido per 90 giorni (cookie).

Non c'è un account individuale per persona: chiunque conosca la password del gruppo entra, vede tutti i sonetti e può scriverne di nuovi firmandoli con il proprio nome. È una scelta voluta per restare semplice, dato il contesto informale.
