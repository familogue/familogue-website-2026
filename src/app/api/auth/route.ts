import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID not configured", { status: 500 });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "public_repo",
  });

  // Pass through state param if Decap sends one
  const state = request.nextUrl.searchParams.get("state");
  if (state) params.set("state", state);

  redirect(`https://github.com/login/oauth/authorize?${params}`);
}
