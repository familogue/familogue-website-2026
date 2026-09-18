// PROTOTYPE — throwaway. Branch prototype/link-accent-colour. Delete before merging to main.
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { PROTOTYPE_VARIANTS, type ProtoVariantKey } from "./variants";

function isTypingTarget(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === "input" ||
    tag === "textarea" ||
    (el as HTMLElement).isContentEditable
  );
}

export function ProtoSwitcher({ current }: { current: ProtoVariantKey }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const index = PROTOTYPE_VARIANTS.findIndex((v) => v.key === current);
  const active = PROTOTYPE_VARIANTS[index] ?? PROTOTYPE_VARIANTS[0];

  const go = useCallback(
    (delta: number) => {
      const next =
        PROTOTYPE_VARIANTS[
          (index + delta + PROTOTYPE_VARIANTS.length) % PROTOTYPE_VARIANTS.length
        ];
      const params = new URLSearchParams(searchParams.toString());
      params.set("variant", next.key);
      router.replace(`?${params.toString()}`, { scroll: false });
    },
    [index, router, searchParams]
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isTypingTarget(document.activeElement)) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 flex flex-wrap items-center justify-center gap-3 rounded-full bg-stone-950 px-4 py-2 text-white shadow-2xl shadow-black/40">
      <button
        type="button"
        onClick={() => go(-1)}
        aria-label="Previous variant"
        className="rounded-full px-2 py-1 text-lg leading-none hover:bg-white/10"
      >
        ←
      </button>
      <span className="text-sm font-medium whitespace-nowrap">
        {active.key} — {active.name}
      </span>
      <button
        type="button"
        onClick={() => go(1)}
        aria-label="Next variant"
        className="rounded-full px-2 py-1 text-lg leading-none hover:bg-white/10"
      >
        →
      </button>
    </div>
  );
}
