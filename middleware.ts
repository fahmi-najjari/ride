import { NextResponse, type NextRequest } from "next/server"

const supportedLocales = new Set(["en", "ar", "fr"])

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const [, maybeLocale, ...rest] = url.pathname.split("/")

  if (!supportedLocales.has(maybeLocale)) {
    return NextResponse.next()
  }

  url.pathname = `/${rest.join("/")}`
  if (url.pathname === "/") {
    url.pathname = "/"
  }

  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
}
