# Full static rebuild on git push replaces ISR + revalidation webhook

Content changes infrequently (weeks to months), and the revalidation webhook was the only attack surface requiring a shared secret. With Decap CMS writing directly to `main`, Vercel's native Git integration auto-deploys on every push — no GitHub Actions workflow required. Each content edit triggers a full static rebuild (~40 s, under 2 min ceiling). The latency trade-off (seconds with ISR vs. under 2 min with full rebuild) is accepted given the update cadence. Eliminating the webhook removes the security surface entirely.

## Consequences

On-demand cache invalidation (`revalidatePath` / `revalidateTag`) was not adopted — it still requires a webhook, trading one attack surface for another with no meaningful latency benefit at this content volume.

The repo must remain public. On Vercel's Hobby plan, auto-deploy from a private GitHub org repo is blocked entirely — making the repo private would break the deploy pipeline without a Pro upgrade or a GitHub Actions workaround.
