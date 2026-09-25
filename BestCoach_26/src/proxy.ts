import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const MAX_SESSION_COOKIE_SIZE = 8192;

export function proxy(request: NextRequest) {
  const cookieNames = [
    "next-auth.session-token",
    "__Secure-next-auth.session-token",
  ];
  const oversizedCookie = cookieNames.find(
    (name) => (request.cookies.get(name)?.value.length ?? 0) > MAX_SESSION_COOKIE_SIZE
  );

  if (!oversizedCookie) return NextResponse.next();

  const response = NextResponse.redirect(new URL("/signin?session=reset", request.url));
  cookieNames.forEach((name) => response.cookies.delete(name));
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};