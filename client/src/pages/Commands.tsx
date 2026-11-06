/**
 * Commands — the curated ADB command list (moved off the homepage in v2.0.0).
 */
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Cpu,
  Package,
  Keyboard,
  Monitor,
  Folder,
  Wifi,
  Terminal,
  Download,
  Copy,
  Check,
  Search,
  ChevronRight,
  Zap,
  Shield,
  Database,
  CalendarDays,
} from "lucide-react";
import ShootingStars from "@/components/ShootingStars";
import { adbCategories, type AdbCommand, type AdbCategory } from "@/data/adbCommands";
import { getArchiveEntries } from "@/lib/adbArchive";

const ICON_MAP: Record<string, React.ElementType> = {
  cpu: Cpu,
  package: Package,
  keyboard: Keyboard,
  monitor: Monitor,
  folder: Folder,
  wifi: Wifi,
  terminal: Terminal,
  download: Download,
};


export function CommandCard({ cmd }: { cmd: AdbCommand }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cmd.command);
      setCopied(true);
      toast.success("Copied to clipboard", {
        description: `> ${cmd.command}`,
        duration: 1800,
        style: {
          background: "#09090B",
          border: "1px solid #FFFFFF",
          color: "#f1f5f9",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
        },
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed — select and copy manually");
    }
  }, [cmd]);

  return (
    <div
      className="group relative rounded border border-zinc-900/25 bg-white/[0.02] backdrop-blur-sm
                 hover:border-zinc-600/55 hover:bg-white/[0.035] transition-all duration-200
                 overflow-hidden card-glow"
    >
      {/* Red left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-zinc-600 via-zinc-700 to-transparent
                      opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Corner bracket top-right */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-zinc-800/40 group-hover:border-zinc-600/60 transition-colors" />
      <div className="absolute bottom-0 left-3 w-3 h-3 border-b border-l border-zinc-800/20 group-hover:border-zinc-600/30 transition-colors" />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-br from-zinc-900/8 via-transparent to-transparent pointer-events-none" />

      <div className="p-4 pl-5">
        {/* Label + copy button */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-xs font-bold text-zinc-400 font-display tracking-widest leading-tight uppercase">
            {cmd.label}
          </h3>
          <button
            onClick={handleCopy}
            aria-label="Copy command"
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-display
                       border transition-all duration-150 active:scale-95 tracking-widest uppercase
                       border-zinc-800/40 text-zinc-600 hover:border-zinc-500 hover:text-white
                       hover:bg-zinc-600/15 hover:shadow-[0_0_12px_rgba(255,255,255,0.25)]"
          >
            {copied ? (
              <>
                <Check size={10} />
                <span>COPIED!</span>
              </>
            ) : (
              <>
                <Copy size={10} />
                <span>COPY</span>
              </>
            )}
          </button>
        </div>

        {/* Command block */}
        <div className="relative mb-2.5 rounded bg-black border border-zinc-900/15 px-3 py-2 overflow-x-auto
                        group-hover:border-zinc-900/30 transition-colors">
          <code className="text-xs text-zinc-100 whitespace-nowrap font-mono leading-relaxed">
            <span className="text-zinc-700 select-none mr-1.5 font-bold">$</span>
            {cmd.command}
          </code>
        </div>

        {/* Description */}
        <p className="text-[11px] text-gray-600 leading-relaxed font-mono">{cmd.description}</p>
      </div>
    </div>
  );
}

/* ── Category Sidebar Nav ── */

function CategoryNav({
  categories,
  activeId,
  onSelect,
  counts,
}: {
  categories: AdbCategory[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  counts: Record<string, number>;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      <button
        onClick={() => onSelect(null)}
        className={`flex items-center gap-2.5 px-3 py-2 rounded text-left transition-all duration-150
          ${activeId === null
            ? "bg-zinc-600/15 text-zinc-400 border border-zinc-600/35 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
            : "text-gray-500 hover:text-zinc-400 hover:bg-zinc-900/8 border border-transparent"
          }`}
      >
        <Zap size={12} className={activeId === null ? "text-zinc-500" : "text-gray-700"} />
        <span className="flex-1 font-display tracking-widest text-[10px] uppercase">All Commands</span>
        <span className="text-[10px] text-gray-700 tabular-nums font-mono">
          {Object.values(counts).reduce((a, b) => a + b, 0)}
        </span>
      </button>

      {categories.map((cat) => {
        const Icon = ICON_MAP[cat.icon] ?? Terminal;
        const isActive = activeId === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded text-left transition-all duration-150
              ${isActive
                ? "bg-zinc-600/15 text-zinc-400 border border-zinc-600/35 shadow-[0_0_8px_rgba(255,255,255,0.1)]"
                : "text-gray-500 hover:text-zinc-400 hover:bg-zinc-900/8 border border-transparent"
              }`}
          >
            <Icon size={12} className={isActive ? "text-zinc-500" : "text-gray-700"} />
            <span className="flex-1 font-display tracking-widest text-[10px] uppercase">{cat.name}</span>
            <span className="text-[10px] text-gray-700 tabular-nums font-mono">{counts[cat.id] ?? 0}</span>
            {isActive && <ChevronRight size={10} className="text-zinc-700" />}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Hero Boot Sequence ── */

export default function Commands() {
  const archiveCount = useMemo(() => getArchiveEntries().length, []);
  const logoClicks = useRef(0);
  const handleLogoClick = useCallback(() => {
    logoClicks.current += 1;
    if (logoClicks.current >= 5) {
      logoClicks.current = 0;
      toast.success("Easter egg found", {
        description: `No secret command here — just ${archiveCount.toLocaleString()} real ones.`,
        duration: 2600,
      });
    }
  }, [archiveCount]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [autoplayFailed, setAutoplayFailed] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as Record<string, unknown> | null;
      if (!data || data.type !== "MANUS_HIDDEN_AUDIO") return;
      if (data.status === "ready") {
        setAudioReady(true);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    if (!audioReady || autoplayAttempted) return;
    const iframe = document.getElementById("hiddenAudioIframe") as HTMLIFrameElement | null;
    const win = iframe?.contentWindow as any;
    if (win?.tryAutoplay) {
      setAutoplayAttempted(true);
      win.tryAutoplay()
        .then(() => {
          setAudioStarted(true);
          setAutoplayFailed(false);
        })
        .catch(() => {
          setAutoplayFailed(true);
        });
    } else {
      setAutoplayAttempted(true);
      setAutoplayFailed(true);
    }
  }, [audioReady, autoplayAttempted]);

  const handleStartAudio = useCallback(() => {
    setAudioStarted(true);
    setAutoplayFailed(false);
    const iframe = document.getElementById("hiddenAudioIframe") as HTMLIFrameElement | null;
    const win = iframe?.contentWindow as any;
    if (win?.playHiddenAudio) {
      win.playHiddenAudio().catch(() => {
        setAutoplayFailed(true);
      });
    } else if (audioReady) {
      iframe?.contentWindow?.postMessage({ type: "MANUS_HIDDEN_AUDIO", action: "play" }, "*" );
    }
  }, [audioReady]);

  const counts: Record<string, number> = {};
  for (const cat of adbCategories) {
    counts[cat.id] = cat.commands.length;
  }

  const filteredCategories = activeCategory
    ? adbCategories.filter((c) => c.id === activeCategory)
    : adbCategories;

  const searchLower = search.toLowerCase();
  const displayCategories = filteredCategories
    .map((cat) => ({
      ...cat,
      commands: search
        ? cat.commands.filter(
            (cmd) =>
              cmd.label.toLowerCase().includes(searchLower) ||
              cmd.command.toLowerCase().includes(searchLower) ||
              cmd.description.toLowerCase().includes(searchLower)
          )
        : cat.commands,
    }))
    .filter((cat) => cat.commands.length > 0);

  const totalVisible = displayCategories.reduce((s, c) => s + c.commands.length, 0);

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden ">
      {/* Animated shooting stars background */}
      <ShootingStars />

      {/* Radial red glow at top */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 35% at 50% 0%, rgba(255,255,255,0.09) 0%, transparent 70%)",
        }}
      />

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded overflow-hidden border border-zinc-800 flex-shrink-0">
              <img src="/nova-logo.svg" alt="Nova Modding" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-display text-sm font-black text-white tracking-widest leading-none">
                Nova <span className="text-zinc-400">Modding</span>
              </div>
              <div className="text-[9px] text-gray-600 tracking-[0.25em] uppercase leading-none mt-1 font-mono">
                ADB Commands
              </div>
            </div>
          </Link>
          <div className="flex-1" />
          <nav className="flex items-center gap-1.5">
            <Link href="/" className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors">HOME</Link>
            <span className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] border bg-white/10 text-white border-zinc-600/60">LIST</span>
            <Link href="/calendar" className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors">CALENDAR</Link>
            <Link href="/help" className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors">HELP</Link>
          </nav>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="hidden lg:block w-52 flex-shrink-0">
            <div className="sticky top-6">
              {/* Sidebar header */}
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-zinc-900/20">
                <span className="text-zinc-700 text-[10px] font-mono">&gt;</span>
                <span className="text-[9px] text-gray-700 font-display tracking-widest uppercase">
                  Categories
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-700" />
                <input
                  type="text"
                  placeholder="Search commands..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black border border-zinc-900/25 rounded pl-7 pr-3 py-1.5
                             text-[11px] text-gray-400 placeholder-gray-800 font-mono tracking-wide
                             focus:outline-none focus:border-zinc-600/50 focus:ring-1 focus:ring-zinc-600/20
                             transition-all duration-150"
                />
              </div>

              <CategoryNav
                categories={adbCategories}
                activeId={activeCategory}
                onSelect={setActiveCategory}
                counts={counts}
              />

              {/* Sidebar footer */}
              <div className="mt-6 pt-3 border-t border-zinc-900/15">
                <p className="text-[9px] text-gray-800 font-mono leading-relaxed">
                  Enable USB debugging before running any ADB command.
                </p>
              </div>
            </div>
          </aside>

          {/* ── COMMAND GRID ── */}
          <main className="flex-1 min-w-0">
            {/* Mobile search */}
            <div className="lg:hidden mb-3 relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-700" />
              <input
                type="text"
                placeholder="Search commands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black border border-zinc-900/25 rounded pl-7 pr-3 py-1.5
                           text-[11px] text-gray-400 placeholder-gray-800 font-mono tracking-wide
                           focus:outline-none focus:border-zinc-600/50 focus:ring-1 focus:ring-zinc-600/20
                           transition-all duration-150"
              />
            </div>

            {/* Mobile category pills */}
            <div className="lg:hidden flex gap-1.5 mb-4 overflow-x-auto pb-1">
              {[{ id: null, name: "ALL" }, ...adbCategories.map((c) => ({ id: c.id, name: c.name }))].map(
                (cat) => (
                  <button
                    key={cat.id ?? "all"}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded text-[10px] font-display tracking-widest uppercase
                      transition-all duration-150 border
                      ${activeCategory === cat.id
                        ? "bg-zinc-600/15 text-zinc-400 border-zinc-600/35"
                        : "text-gray-600 border-zinc-900/15 hover:text-zinc-400 hover:border-zinc-800/30"
                      }`}
                  >
                    {cat.name}
                  </button>
                )
              )}
            </div>

            {/* Results prompt line */}
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-zinc-900/15">
              <div className="flex items-center gap-2">
                <span className="text-zinc-700 font-mono text-xs status-pulse">&gt;</span>
                <span className="text-gray-600 text-[11px] font-mono uppercase tracking-widest">
                  {search
                    ? `${totalVisible} result${totalVisible !== 1 ? "s" : ""} for "${search}"`
                    : activeCategory
                    ? adbCategories.find((c) => c.id === activeCategory)?.name
                    : "All commands"}
                </span>
              </div>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[10px] text-gray-700 hover:text-zinc-500 transition-colors font-mono tracking-widest"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Categories + command cards */}
            <AnimatePresence mode="wait">
              {displayCategories.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-24 text-gray-800 font-mono text-xs"
                >
                  <Terminal size={28} className="mx-auto mb-4 text-zinc-900/30" />
                  <p className="text-gray-700 tracking-widest">No commands match your search</p>
                  <p className="text-gray-800 mt-1">Try a different search.</p>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {displayCategories.map((cat, catIdx) => {
                    const Icon = ICON_MAP[cat.icon] ?? Terminal;
                    return (
                      <div key={cat.id} className="mb-10">
                        {/* Category header */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-zinc-800 font-mono text-[10px]">&gt;</span>
                            <Icon size={13} className="text-zinc-600" />
                            <h2 className="font-display text-xs font-bold text-white tracking-[0.2em] uppercase">
                              {cat.name}
                            </h2>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-zinc-900/30 to-transparent" />
                          <span className="text-[10px] text-gray-700 font-mono tabular-nums">
                            {cat.commands.length}
                          </span>
                        </div>

                        {/* Command cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {cat.commands.map((cmd, cmdIdx) => (
                            <motion.div
                              key={cmd.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                delay: catIdx * 0.03 + cmdIdx * 0.04,
                                duration: 0.2,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                            >
                              <CommandCard cmd={cmd} />
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {autoplayFailed && !audioStarted && (
        <button
          type="button"
          onClick={handleStartAudio}
          className="fixed inset-0 z-[60] bg-transparent border-none p-0 m-0"
          aria-label="Start background audio"
          style={{ display: "block", opacity: 0, cursor: "pointer" }}
        />
      )}

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-zinc-900/20 mt-4 py-5 px-4 bg-black/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] text-gray-700 font-mono">
            <span className="text-zinc-700">&gt;_</span>
            <span className="tracking-widest">Nova Modding v2.0.0</span>
          </div>
          <p className="text-[10px] text-gray-800 font-mono text-center tracking-wide">
            ⚠ USE AT YOUR OWN RISK — ENABLE USB DEBUGGING BEFORE EXECUTING ANY ADB COMMAND
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-800 font-mono">
            <span>{archiveCount.toLocaleString()} commands</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
