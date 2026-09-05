export const AUTH_COOKIE_NAME = "murodelpianto_auth";
export const NOME_COOKIE_NAME = "murodelpianto_nome";
const AUTH_PAYLOAD = "autenticato";

function getSecret() {
  const secret = process.env.AUTH_SECRET ?? process.env.SITE_PASSWORD;
  if (!secret) {
    throw new Error("Manca la variabile d'ambiente SITE_PASSWORD (o AUTH_SECRET).");
  }
  return secret;
}

async function hmac(message: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAuthToken() {
  const signature = await hmac(AUTH_PAYLOAD);
  return `${AUTH_PAYLOAD}.${signature}`;
}

export async function verifyAuthToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (payload !== AUTH_PAYLOAD || !signature) return false;
  const expected = await hmac(AUTH_PAYLOAD);
  if (expected.length !== signature.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return mismatch === 0;
}
