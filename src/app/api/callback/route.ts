import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return new Response("Missing OAuth code", { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return new Response("OAuth not configured", { status: 500 });
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  if (!tokenRes.ok) {
    return new Response("Token exchange failed", { status: 502 });
  }

  const data = await tokenRes.json() as { access_token?: string; error?: string };

  if (data.error || !data.access_token) {
    return new Response(`GitHub error: ${data.error ?? "no token"}`, { status: 502 });
  }

  // Decap CMS requires a two-step handshake: popup pings "authorizing:github",
  // Decap echoes it back, then popup sends the token to the echoed origin.
  const token = JSON.stringify(data.access_token);

  const html = `<!DOCTYPE html>
<html>
<head><title>Authorizing…</title></head>
<body>
<script>
(function () {
  function receiveMessage(e) {
    if (e.data === "authorizing:github") {
      window.opener.postMessage(
        "authorization:github:success:" + JSON.stringify({ token: ${token}, provider: "github" }),
        e.origin
      );
    }
  }
  window.addEventListener("message", receiveMessage, { once: true });
  window.opener.postMessage("authorizing:github", "*");
})();
</script>
<p>Authorization complete. You may close this window.</p>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
