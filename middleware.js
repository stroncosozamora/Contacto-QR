import { NextResponse } from "next/server";

export function middleware(request) {
  const auth = request.headers.get("authorization");
  const user = process.env.ADMIN_USER || "admin";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse("Configura ADMIN_PASSWORD en Vercel.", {
      status: 503,
    });
  }

  if (auth?.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const separator = decoded.indexOf(":");
      const suppliedUser = decoded.slice(0, separator);
      const suppliedPassword = decoded.slice(separator + 1);

      if (suppliedUser === user && suppliedPassword === password) {
        return NextResponse.next();
      }
    } catch {
      // Continúa hacia el desafío de autenticación.
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Administración QR"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*", "/api/status", "/api/export"],
};
