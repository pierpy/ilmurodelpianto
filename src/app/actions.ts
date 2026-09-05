"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, NOME_COOKIE_NAME, createAuthToken } from "@/lib/auth";

const NOME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

async function ricordaNome(nome: string) {
  if (!nome) return;
  const cookieStore = await cookies();
  cookieStore.set(NOME_COOKIE_NAME, nome, {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: NOME_COOKIE_MAX_AGE,
  });
}

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const nome = String(formData.get("nome") ?? "").trim();
  const next = String(formData.get("next") ?? "/");

  if (password !== process.env.SITE_PASSWORD) {
    redirect(`/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const token = await createAuthToken();
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });

  await ricordaNome(nome);

  redirect(next || "/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

export async function createSonetto(formData: FormData) {
  const autore = String(formData.get("autore") ?? "").trim();
  const bersaglio = String(formData.get("bersaglio") ?? "").trim();
  const titolo = String(formData.get("titolo") ?? "").trim();
  const testo = String(formData.get("testo") ?? "").trim();

  if (!autore || !titolo || !testo) {
    throw new Error("Compila il tuo nome, il titolo e il testo del sonetto.");
  }

  await prisma.sonetto.create({
    data: {
      titolo,
      testo,
      autore,
      bersaglio: bersaglio || null,
    },
  });

  await ricordaNome(autore);

  revalidatePath("/");
  revalidatePath("/classifica");
  redirect("/");
}

const TIPI_REAZIONE = ["fuoco", "morto", "applauso"] as const;
export type TipoReazione = (typeof TIPI_REAZIONE)[number];

export async function reagisci(sonettoId: string, tipo: TipoReazione) {
  if (!TIPI_REAZIONE.includes(tipo)) return;

  await prisma.reazione.create({
    data: { sonettoId, tipo },
  });

  revalidatePath("/");
  revalidatePath("/classifica");
}

export async function createCommento(formData: FormData) {
  const sonettoId = String(formData.get("sonettoId") ?? "");
  const autore = String(formData.get("autore") ?? "").trim();
  const testo = String(formData.get("testo") ?? "").trim();

  if (!sonettoId || !autore || !testo) {
    throw new Error("Compila il tuo nome e il commento.");
  }

  await prisma.commento.create({
    data: { sonettoId, autore, testo },
  });

  await ricordaNome(autore);

  revalidatePath("/");
  revalidatePath("/classifica");
}
