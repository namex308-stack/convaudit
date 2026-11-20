import { NextRequest, NextResponse } from "next/server";

const AGENT_DISCOVERY_LINK =
  '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="describedby"; type="text/plain"';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const acceptsMarkdown = request.headers
    .get("accept")
    ?.toLowerCase()
    .includes("text/markdown");
  let response = NextResponse.next();

  if (
    acceptsMarkdown &&
    (pathname === "/" || pathname.startsWith("/tools/"))
  ) {
    const destination = request.nextUrl.clone();
    destination.pathname = "/api/markdown";
    destination.searchParams.set("path", pathname);
    response = NextResponse.rewrite(destination);
  }

  if (pathname === "/") {
    response.headers.append("Link", AGENT_DISCOVERY_LINK);
  }

  response.headers.append("Vary", "Accept");

  return response;
}

export const config = {
  matcher: ["/", "/tools/:path*"],
};
