import { NextResponse, type NextRequest } from "next/server";
import { decrypt } from "./lib/session";

const PUBLIC_ROUTES = ["/login", "/recuperar-acesso"];

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));

  const token = req.cookies.get("forecast_session")?.value;
  const session = await decrypt(token);

  if (!isPublic && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublic && session) {
    return NextResponse.redirect(
      new URL(session.role === "executive" ? "/dashboard" : "/gestor", req.url)
    );
  }

  if (session && session.role === "executive" && pathname.startsWith("/gestor")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const executiveOnlyPrefixes = ["/dashboard", "/forecast", "/historico", "/sheets", "/configuracoes"];
  if (
    session &&
    (session.role === "manager" || session.role === "admin") &&
    executiveOnlyPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
  ) {
    return NextResponse.redirect(new URL("/gestor", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
