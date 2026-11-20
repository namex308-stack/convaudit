import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptsMarkdown = request.headers
    .get("accept")
    ?.toLowerCase()
    .includes("text/markdown");

  if (
    !acceptsMarkdown ||
    (pathname !== "/" && !pathname.startsWith("/tools/"))
  ) {
    return NextResponse.next();
  }

  const destination = request.nextUrl.clone();
  destination.pathname = "/api/markdown";
  destination.searchParams.set("path", pathname);

  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: ["/", "/tools/:path*"],
};
