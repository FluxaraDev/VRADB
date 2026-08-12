import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Database, Search, Terminal, ChevronLeft, ChevronRight } from "lucide-react";
import list1Text from "@/data/list1.txt?raw";
import list2Text from "@/data/list2.txt?raw";
import { CommandCard } from "./Home";
import ShootingStars from "@/components/ShootingStars";

type ArchiveEntry = {
  id: string;
  source: string;
  text: string;
};

const ARCHIVE_SOURCES = [
  { label: "list1.txt", raw: list1Text },
  { label: "list2.txt", raw: list2Text },
] as const;

const PAGE_SIZE = 50;

const extractQuotedSegments = (text: string): string[] => {
  const quoted = text.match(/"([^"]+)"/g) ?? [];
  return quoted
    .map((segment) => segment.replace(/^"|"$/g, "").trim())
    .filter(Boolean);
};

const splitCandidateParts = (text: string): string[] => {
  return text
    .split(/(?:&&|;)/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^["'`]+|["'`,]+$/g, "").trim())
    .filter(Boolean);
};

const normalizeCommand = (raw: string): string | null => {
  const cleaned = raw
    .replace(/^[-*•]\s*/, "")
    .replace(/^\d+[.)-]\s*/, "")
    .replace(/^"|"$/g, "")
    .replace(/^[\s'"`]+|[\s'"`,]+$/g, "")
    .replace(/\r/g, "")
    .trim();

  if (!cleaned) return null;

  const normalizedText = cleaned.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
  const lower = normalizedText.toLowerCase();

  if (lower.includes("adb shell")) {
    const withoutPrefix = normalizedText.replace(/^adb\s+shell\s+/i, "").trim();
    if (!withoutPrefix) return null;
    return `adb shell ${withoutPrefix}`.replace(/\s+/g, " ").trim();
  }

  if (normalizedText.startsWith("setprop ")) {
    return `adb shell ${normalizedText}`.replace(/\s+/g, " ").trim();
  }

  const propertyMatch = normalizedText.match(/(?:debug|persist\.debug)\.oculus\.[A-Za-z0-9_.-]+/i);
  if (propertyMatch) {
    const prop = propertyMatch[0];
    const rest = normalizedText.slice(normalizedText.indexOf(prop) + prop.length).trim();
    const value = rest && !/^[:=,;]+$/.test(rest) ? rest : "1";
    return `adb shell setprop ${prop} ${value}`.replace(/\s+/g, " ").trim();
  }

  return null;
};

function parseArchiveText(raw: string, sourceLabel: string): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];

  raw.split(/\r?\n/).forEach((line, lineIndex) => {
    const base = line.trim();
    if (!base) return;

    const candidates = [base, ...extractQuotedSegments(base)];

    candidates.forEach((candidate) => {
      splitCandidateParts(candidate).forEach((part) => {
        const normalized = normalizeCommand(part);
        if (!normalized) return;

        entries.push({
          id: `${sourceLabel}-${lineIndex}-${normalized.slice(0, 80)}-${Math.random().toString(36).slice(2, 8)}`,
          source: sourceLabel,
          text: normalized,
        });
      });
    });
  });

  return entries;
}

export default function ADBArchive() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let active = true;

    const loadArchive = () => {
      try {
        setLoading(true);
        setError(null);

        const parsedEntries = ARCHIVE_SOURCES.flatMap(({ label, raw }) =>
          parseArchiveText(raw, label)
        );

        if (!active) return;
        setEntries(parsedEntries);
      } catch (loadError) {
        if (!active) return;
        console.error(loadError);
        setError("Unable to load the local ADB list files.");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadArchive();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) => {
      const haystack = `${entry.text} ${entry.source}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [entries, search]);

  const pageCount = Math.max(1, Math.ceil(filteredEntries.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedEntries = filteredEntries.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden crt-scanlines crt-noise">
      <ShootingStars />
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 35% at 50% 0%, rgba(220,38,38,0.09) 0%, transparent 70%)",
        }}
      />

      <header className="relative z-10 border-b border-red-900/25 bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded border border-red-900/30 text-[10px] font-mono tracking-[0.2em] uppercase text-red-400 hover:border-red-600/50 hover:text-red-300 transition-colors">
              <ArrowLeft size={12} />
              HOME
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded border border-red-700/50 bg-red-950/30 flex items-center justify-center">
                <Database size={18} className="text-red-500" />
              </div>
              <div>
                <div className="font-display text-sm font-black text-white tracking-widest leading-none">
                  NOVA<span className="text-red-500">ADBS</span>
                </div>
                <div className="text-[9px] text-gray-700 tracking-[0.2em] uppercase leading-none mt-0.5 font-mono">
                  ADB LIST
                </div>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-gray-700">
            <Terminal size={10} className="text-red-700" />
            <span>
              <span className="text-red-600 font-bold">{filteredEntries.length}</span> MATCHED
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="mb-8 rounded border border-red-900/25 bg-black/70 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-700 text-[10px] font-mono">&gt;</span>
                <span className="text-gray-600 text-[10px] uppercase tracking-[0.2em] font-mono">
                  COMMAND LIST
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white">
                ADB <span className="text-red-500">LIST</span>
              </h1>
            </div>

            <div className="relative w-full md:max-w-md">
              <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                placeholder="SEARCH ADB COMMANDS..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full bg-black border border-red-900/25 rounded pl-9 pr-3 py-2 text-[11px] text-gray-300 placeholder-gray-700 font-mono tracking-wide focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20"
              />
            </div>
          </div>
        </section>

        {!loading && !error && (
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-gray-600">
              <span>PAGE</span>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={safePage}
                onChange={(event) => {
                  const nextPage = Number(event.target.value) || 1;
                  setPage(Math.min(pageCount, Math.max(1, nextPage)));
                }}
                className="w-16 bg-black border border-red-900/25 rounded px-2 py-1 text-red-400 text-center focus:outline-none focus:border-red-600/50"
              />
              <span>OF {pageCount}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 rounded border border-red-900/25 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-600/50 hover:text-red-300 transition-colors"
              >
                <ChevronLeft size={12} />
                PREV
              </button>
              <button
                onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                disabled={safePage >= pageCount}
                className="inline-flex items-center gap-1 rounded border border-red-900/25 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-600/50 hover:text-red-300 transition-colors"
              >
                NEXT
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="rounded border border-red-900/25 bg-black/60 p-10 text-center text-gray-400 font-mono text-xs tracking-[0.2em] uppercase">
            LOADING LIST DATA...
          </div>
        )}

        {!loading && error && (
          <div className="rounded border border-red-900/25 bg-red-950/20 p-6 text-red-300 font-mono text-xs tracking-wide">
            {error}
          </div>
        )}

        {!loading && !error && filteredEntries.length === 0 && (
          <div className="rounded border border-red-900/25 bg-black/60 p-10 text-center text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">
            NO MATCHES FOUND
          </div>
        )}

        {!loading && !error && filteredEntries.length > 0 && (
          <>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {pagedEntries.map((entry) => (
                <CommandCard
                  key={entry.id}
                  cmd={{
                    id: entry.id,
                    label: entry.source,
                    command: entry.text,
                    description: entry.source,
                  }}
                />
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-gray-600">
                <span>SHOWING</span>
                <span className="text-red-400">{Math.min(filteredEntries.length, (safePage - 1) * PAGE_SIZE + 1)}-{Math.min(filteredEntries.length, safePage * PAGE_SIZE)}</span>
                <span>OF {filteredEntries.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={safePage <= 1}
                  className="inline-flex items-center gap-1 rounded border border-red-900/25 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-600/50 hover:text-red-300 transition-colors"
                >
                  <ChevronLeft size={12} />
                  PREV
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
                  disabled={safePage >= pageCount}
                  className="inline-flex items-center gap-1 rounded border border-red-900/25 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 disabled:opacity-40 disabled:cursor-not-allowed hover:border-red-600/50 hover:text-red-300 transition-colors"
                >
                  NEXT
                  <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
