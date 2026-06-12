import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

const ALLOWED_PROVIDERS = ["github"];

export function GET(request: NextRequest) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID not configured", { status: 500 });
  }

  const provider = request.nextUrl.searchParams.get("provider") ?? "github";
  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return new Response("Invalid provider", { status: 400 });
  }

  const repoIsPrivate = process.env.GITHUB_REPO_PRIVATE === "1";
  const scope = repoIsPrivate ? "repo,user" : "public_repo,user";

  const params = new URLSearchParams({
    client_id: clientId,
    scope,
    redirect_uri: `${request.nextUrl.origin}/api/callback`,
  });

  const state = request.nextUrl.searchParams.get("state");
  if (state) params.set("state", state);

  redirect(`https://github.com/login/oauth/authorize?${params}`);
}
