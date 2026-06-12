import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("GET /api/callback", () => {
  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = "test-client-id";
    process.env.GITHUB_CLIENT_SECRET = "test-secret";
  });

  afterEach(() => {
    delete process.env.GITHUB_CLIENT_ID;
    delete process.env.GITHUB_CLIENT_SECRET;
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("returns HTML with postMessage containing the access token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: "ghs_testtoken123" }),
      })
    );

    const { GET } = await import("src/app/api/callback/route");
    const nextReq = {
      nextUrl: new URL("http://localhost/api/callback?code=oauthcode"),
    } as Parameters<typeof GET>[0];

    const res = await GET(nextReq);
    const body = await res.text();

    expect(body).toContain("postMessage");
    expect(body).toContain("ghs_testtoken123");
    expect(body).toContain("github");
  });

  it("returns 400 when code param missing", async () => {
    const { GET } = await import("src/app/api/callback/route");
    const nextReq = {
      nextUrl: new URL("http://localhost/api/callback"),
    } as Parameters<typeof GET>[0];

    const res = await GET(nextReq);
    expect(res.status).toBe(400);
  });

  it("returns 502 when GitHub token exchange fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ error: "bad_verification_code" }),
      })
    );

    const { GET } = await import("src/app/api/callback/route");
    const nextReq = {
      nextUrl: new URL("http://localhost/api/callback?code=badcode"),
    } as Parameters<typeof GET>[0];

    const res = await GET(nextReq);
    expect(res.status).toBe(502);
  });
});
