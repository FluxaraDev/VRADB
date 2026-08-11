import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Database, Search, Terminal } from "lucide-react";

type ArchiveEntry = {
  id: string;
  source: string;
  text: string;
};

const ARCHIVE_SOURCES = [
  {
    label: "hellaadbs.txt",
    url: "https://marbleshub.neocities.org/ASSETS/hellaadbs.txt",
  },
  {
    label: "Adbs.txt",
    url: "https://marbleshub.neocities.org/ASSETS/Adbs%20.txt",
  },
] as const;

const GROUP_SIZE = 50;

function parseArchiveText(raw: string, sourceLabel: string): ArchiveEntry[] {
  const seen = new Set<string>();

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const normalized = line.toLowerCase();
      return (
        normalized.includes("adb") ||
        normalized.includes("setprop") ||
        normalized.includes("settings") ||
        normalized.includes("debug") ||
        normalized.includes("dumpsys") ||
        normalized.includes("cmd ") ||
        normalized.includes("pm ") ||
        normalized.includes("am ")
      );
    })
    .map((line, index) => {
      const cleaned = line
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+[.)-]\s*/, "")
        .trim();

      if (!cleaned) return null;

      const id = `${sourceLabel}-${index}-${cleaned.slice(0, 80)}`;
      if (seen.has(id)) return null;
      seen.add(id);

      return {
        id,
        source: sourceLabel,
        text: cleaned,
      };
    })
    .filter((entry): entry is ArchiveEntry => Boolean(entry));
}

export default function ADBArchive() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;

    const loadArchive = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/archive", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("Archive API failed");
        }

        const payload = (await response.json()) as { entries?: ArchiveEntry[] };

        if (!active) return;
        setEntries(payload.entries ?? []);
      } catch (loadError) {
        if (!active) return;
        console.error(loadError);

        try {
          const groups = await Promise.all(
            ARCHIVE_SOURCES.map(async ({ url, label }) => {
              const remoteResponse = await fetch(url, { cache: "no-store" });
              if (!remoteResponse.ok) {
                throw new Error(`Failed to load ${label}`);
              }
              const raw = await remoteResponse.text();
              return parseArchiveText(raw, label);
            })
          );

          if (!active) return;
          setEntries(groups.flat());
        } catch {
          if (!active) return;
          setError("Unable to load the remote archive right now. Please try again in a moment.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadArchive();
    return () => {
      active = false;
    };
  }, []);

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return entries;

    return entries.filter((entry) => {
      const haystack = `${entry.text} ${entry.source}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [entries, search]);

  const groups = useMemo(() => {
    const packed: ArchiveEntry[][] = [];
    for (let index = 0; index < filteredEntries.length; index += GROUP_SIZE) {
      packed.push(filteredEntries.slice(index, index + GROUP_SIZE));
    }
    return packed;
  }, [filteredEntries]);

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden crt-scanlines crt-noise">
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
                  VR<span className="text-red-500">ADB</span>
                </div>
                <div className="text-[9px] text-gray-700 tracking-[0.2em] uppercase leading-none mt-0.5 font-mono">
                  Remote ADB Archive
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
                  Archive Loader
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white">
                ADB <span className="text-red-500">TEXT</span> ARCHIVE
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

        {loading && (
          <div className="rounded border border-red-900/25 bg-black/60 p-10 text-center text-gray-400 font-mono text-xs tracking-[0.2em] uppercase">
            LOADING ARCHIVE DATA...
          </div>
        )}

        {!loading && error && (
          <div className="rounded border border-red-900/25 bg-red-950/20 p-6 text-red-300 font-mono text-xs tracking-wide">
            {error}
          </div>
        )}

        {!loading && !error && groups.length === 0 && (
          <div className="rounded border border-red-900/25 bg-black/60 p-10 text-center text-gray-500 font-mono text-xs tracking-[0.2em] uppercase">
            NO MATCHES FOUND
          </div>
        )}

        {!loading && !error && groups.length > 0 && (
          <div className="space-y-8">
            {groups.map((group, groupIndex) => (
              <section
                key={`group-${groupIndex + 1}`}
                className="rounded border border-red-900/25 bg-black/60 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-red-900/20 bg-red-950/10">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-red-400">
                    Group {String(groupIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-gray-600">
                    {group.length} entries
                  </span>
                </div>

                <div className="grid gap-2 p-3 md:grid-cols-2 xl:grid-cols-3">
                  {group.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded border border-red-900/20 bg-white/[0.02] px-3 py-2 text-[11px] leading-relaxed font-mono text-gray-300"
                    >
                      <div className="mb-1 text-[9px] uppercase tracking-[0.2em] text-red-700">
                        {entry.source}
                      </div>
                      <code className="block whitespace-pre-wrap break-words text-green-400">
                        <span className="text-red-600 mr-2">$</span>
                        {entry.text}
                      </code>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
