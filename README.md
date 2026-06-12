# Familogue Website

Next.js website for Familogue. Content managed via [Decap CMS](https://decapcms.org/) at `/admin`.

## Local development

```bash
npm install
npm run dev
```

To use the CMS locally, run the Decap proxy in a second terminal:

```bash
npx decap-server
```

Then visit `http://localhost:3000/admin`. The local backend writes directly to the filesystem — no GitHub auth required.

## Vercel deployment

### Required environment variables

| Variable | Description |
|---|---|
| `GITHUB_CLIENT_ID` | GitHub OAuth App client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth App client secret |
| `GITHUB_REPO_PRIVATE` | Set to `1` if the content repo is private (requests `repo,user` scope instead of `public_repo,user`). Omit or leave blank for public repos. |

### GitHub OAuth App setup

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set **Homepage URL** to your production domain (e.g. `https://familogue.ca`)
3. Set **Authorization callback URL** to `https://familogue.ca/api/callback`
4. Copy the **Client ID** and generate a **Client secret**
5. Add both as Vercel environment variables

The `provider` query parameter is forwarded automatically by Decap CMS — no extra configuration is needed.

### Enable OAuth in Decap config

Once the OAuth App is registered and env vars are set, update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: familogue/familogue-website-2026
  branch: main
  base_url: https://familogue.ca
  auth_endpoint: /api/auth
```

Remove the `local_backend: true` line before deploying.

### Local OAuth testing

To test the GitHub OAuth flow locally (rather than bypassing it with `npx decap-server`), add these to `.env.local`:

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

You will also need a GitHub OAuth App whose **Authorization callback URL** points to `http://localhost:3000/api/callback`. A separate OAuth App for local development is recommended so production credentials stay isolated.
