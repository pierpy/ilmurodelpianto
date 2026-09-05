import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|sfondo|login).*)"],
};

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const authed = await verifyAuthToken(token);

  if (!authed) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
