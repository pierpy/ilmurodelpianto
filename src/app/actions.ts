"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { AUTH_COOKIE_NAME, createAuthToken } from "@/lib/auth";

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
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

  redirect(next || "/");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}

export async function createSonetto(formData: FormData) {
  const autoreId = String(formData.get("autoreId") ?? "");
  const bersaglioId = String(formData.get("bersaglioId") ?? "");
  const titolo = String(formData.get("titolo") ?? "").trim();
  const testo = String(formData.get("testo") ?? "").trim();

  if (!autoreId || !titolo || !testo) {
    throw new Error("Compila autore, titolo e testo del sonetto.");
  }

  await prisma.sonetto.create({
    data: {
      titolo,
      testo,
      autoreId,
      bersaglioId: bersaglioId || null,
    },
  });

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
