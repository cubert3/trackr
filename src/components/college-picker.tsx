"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

const COOKIE_NAME = "trackr_college";

interface CollegePickerProps {
  colleges: { slug: string; shortName: string | null; name: string }[];
}

function readCollegeCookie(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : "";
}

function writeCollegeCookie(slug: string) {
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(slug)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function CollegePicker({ colleges }: CollegePickerProps) {
  const router = useRouter();
  const params = useSearchParams();
  const [myCollege, setMyCollege] = useState("");

  useEffect(() => {
    setMyCollege(readCollegeCookie());
  }, []);

  function selectCollege(slug: string) {
    if (slug) writeCollegeCookie(slug);
    else document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
    setMyCollege(slug);

    const next = new URLSearchParams(params.toString());
    if (slug) next.set("college", slug);
    else next.delete("college");
    router.push(`/?${next.toString()}`);
  }

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-200">
        <GraduationCap className="h-4 w-4" />
        Your college
      </div>
      <select
        value={myCollege || params.get("college") || ""}
        onChange={(e) => selectCollege(e.target.value)}
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-white focus:border-violet-500/50 focus:outline-none"
      >
        <option value="">All colleges</option>
        {colleges.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.shortName ?? c.name}
          </option>
        ))}
      </select>
      <p className="mt-2 text-xs text-zinc-500">
        Saved on this device — shows trending events at your campus first.
      </p>
    </div>
  );
}

export { COOKIE_NAME, readCollegeCookie };
