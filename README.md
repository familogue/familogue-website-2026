# Familogue Website

Next.js website for Familogue.

## Local development

```bash
npm install
npm run dev
```

## Deploying

Deploys are manual; merging to `main` does not publish (see [ADR-0002](docs/adr/0002-static-rebuild-on-git-push.md)). Set `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID` and `VERCEL_TOKEN` (`familoguesystems` account) in a gitignored `.envrc`, then:

```bash
vercel pull --yes --environment=production
vercel build --prod
vercel deploy --prebuilt --prod
```
