"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, BANGALORE_LOCALITIES } from "@/lib/constants";
import { Search } from "lucide-react";

interface EventFiltersProps {
  colleges: { slug: string; shortName: string | null; name: string }[];
}

export function EventFilters({ colleges }: EventFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder="Search hackathons, meetups..."
          defaultValue={params.get("q") ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            const timeout = setTimeout(() => update("q", val), 300);
            return () => clearTimeout(timeout);
          }}
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500/50 focus:outline-none focus:ring-1 focus:ring-violet-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={params.get("category") ?? ""}
          onChange={(e) => update("category", e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-violet-500/50 focus:outline-none"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={params.get("locality") ?? ""}
          onChange={(e) => update("locality", e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-violet-500/50 focus:outline-none"
        >
          <option value="">All areas</option>
          {BANGALORE_LOCALITIES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={params.get("college") ?? ""}
          onChange={(e) => update("college", e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-300 focus:border-violet-500/50 focus:outline-none"
        >
          <option value="">All colleges</option>
          {colleges.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.shortName ?? c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
