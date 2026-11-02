import { SITE_CONFIG } from "@/lib/tools";

export const dynamic = "force-dynamic";

export function GET() {
  const client = SITE_CONFIG.adsenseClient;
  if (!/^ca-pub-\d{16}$/.test(client)) {
    return new Response(null, {
      status: 404,
      headers: { "Cache-Control": "no-store" },
    });
  }

  return new Response(
    `google.com, ${client.slice(3)}, DIRECT, f08c47fec0942fa0\n`,
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
