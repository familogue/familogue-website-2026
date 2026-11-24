# Full static rebuild on deploy replaces ISR + revalidation webhook

Content changes infrequently (weeks to months), and the revalidation webhook was the only attack surface requiring a shared secret. Each content change is published by a full static rebuild and a manual production deploy with the Vercel CLI (see README, "Deploying"). A rebuild takes ~40 s, under a 2 min ceiling. The latency trade-off (seconds with ISR vs. under 2 min with full rebuild) is accepted given the update cadence. Eliminating the webhook removes the security surface entirely.

## Consequences

On-demand cache invalidation (`revalidatePath` / `revalidateTag`) was not adopted — it still requires a webhook, trading one attack surface for another with no meaningful latency benefit at this content volume.

Vercel's Git integration is not used. Hobby blocks auto-deploy when the commit author doesn't match the Vercel account. Production deploys are manual with the Vercel CLI (see README). Merging to `main` does not publish the site.
