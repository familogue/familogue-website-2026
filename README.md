# Familogue Website

Next.js website for Familogue.

## Local development

```bash
npm install
npm run dev
```

## Deploying

Production deploys are manual. The Vercel Git integration is not connected (see [ADR-0002](docs/adr/0002-static-rebuild-on-git-push.md)), so merging to `main` does not publish the site.

The project is on the `familoguesystems` Hobby account. Point the CLI at it with these environment variables, for example in a gitignored `.envrc`:

```bash
export VERCEL_ORG_ID=<account ID>
export VERCEL_PROJECT_ID=<project ID>
export VERCEL_TOKEN=<token created under familoguesystems>
```

Then, from the repo root on an up-to-date `main`:

```bash
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```

Deploying the prebuilt output uploads only `.vercel/output`, so local files such as `.envrc` are never sent to Vercel.
