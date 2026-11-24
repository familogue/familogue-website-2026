# Full static rebuild on deploy replaces ISR + revalidation webhook

Content changes infrequently (weeks to months), and the revalidation webhook was the only attack surface requiring a shared secret. Each content change is published by a full static rebuild and a manual production deploy with the Vercel CLI (see README, "Deploying"). A rebuild takes ~40 s, under a 2 min ceiling. The latency trade-off (seconds with ISR vs. under 2 min with full rebuild) is accepted given the update cadence. Eliminating the webhook removes the security surface entirely.

## Consequences

On-demand cache invalidation (`revalidatePath` / `revalidateTag`) was not adopted — it still requires a webhook, trading one attack surface for another with no meaningful latency benefit at this content volume.

Vercel's native Git integration is not used. The site lives on a Hobby account (`familoguesystems`), and Hobby only auto-deploys commits whose author matches the Vercel account's linked Git user. Commits from other authors, or from a GitHub org repo under a different identity, are blocked; lifting that needs a Pro plan. Production deploys are therefore run by hand with the CLI. A GitHub Actions workflow using `vercel deploy --prebuilt --prod` is the fallback if manual deploys become a burden.

Merging to `main` does not publish anything. A deploy must be run after each content change.
