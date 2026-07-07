import Link from "next/link";
import { MapPin, Plus, Radar } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-500 transition-colors">
            <Radar className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Trackr
            </span>
            <span className="ml-2 hidden text-xs text-zinc-500 sm:inline">
              hyperlocal events
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="hidden items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors sm:flex"
          >
            <MapPin className="h-4 w-4" />
            Bangalore
          </Link>
          <Link
            href="/submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white hover:bg-violet-500 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add event nearby</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
