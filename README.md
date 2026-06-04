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

### GitHub OAuth App setup

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**
2. Set **Homepage URL** to your production domain (e.g. `https://familogue.ca`)
3. Set **Authorization callback URL** to `https://familogue.ca/api/callback`
4. Copy the **Client ID** and generate a **Client secret**
5. Add both as Vercel environment variables

### Enable OAuth in Decap config

Once the OAuth App is registered and env vars are set, update `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: calvincchan/familogue-website-2025
  branch: main
  base_url: https://familogue.ca
  auth_endpoint: /api/auth
```

Remove the `local_backend: true` line before deploying.
