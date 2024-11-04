import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  const signinUrl = new URL("/auth/signin", request.url);
  const chatUrl = new URL("/chat", request.url);

  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (token) {
      return NextResponse.redirect(chatUrl);
    }
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(signinUrl);
  }

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(chatUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts).*)"],
};
