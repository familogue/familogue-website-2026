import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

let lastRedirectUrl = "";

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    lastRedirectUrl = url;
    throw new Error("NEXT_REDIRECT");
  },
}));

describe("GET /api/auth", () => {
  beforeEach(() => {
    process.env.GITHUB_CLIENT_ID = "test-client-id";
    lastRedirectUrl = "";
  });

  afterEach(() => {
    delete process.env.GITHUB_CLIENT_ID;
  });

  it("redirects to GitHub OAuth authorize URL with correct params", async () => {
    const { GET } = await import("src/app/api/auth/route");
    const nextReq = { nextUrl: new URL("http://localhost/api/auth") } as Parameters<typeof GET>[0];

    try {
      await GET(nextReq);
    } catch {
      // redirect() throws NEXT_REDIRECT — expected
    }

    expect(lastRedirectUrl).toContain("https://github.com/login/oauth/authorize");
    expect(lastRedirectUrl).toContain("client_id=test-client-id");
    expect(lastRedirectUrl).toContain("scope=public_repo");
  });

  it("returns 500 when GITHUB_CLIENT_ID missing", async () => {
    delete process.env.GITHUB_CLIENT_ID;
    const { GET } = await import("src/app/api/auth/route");
    const nextReq = { nextUrl: new URL("http://localhost/api/auth") } as Parameters<typeof GET>[0];
    const res = await GET(nextReq);
    expect(res.status).toBe(500);
  });
});
