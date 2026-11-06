/**
 * Home — VR ADB Command Key Mapper
 * Monochrome: pure black, CRT scanlines, red shooting stars, boot-sequence hero,
 * monospace command cards with copy-to-clipboard.
 *
 * Style: Monochrome — war-room console for VR power users.
 * Colors: #000 bg, #ffffff brand red, #09bb3c glow, #22C55E code syntax (secondary only)
 * Fonts: Orbitron (display), JetBrains Mono (body/code)
 */
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
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

/* ── Command Card ── */
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
function HeroBoot() {
  const archiveCount = useMemo(() => getArchiveEntries().length, []);
  return (
    <section
      className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-900/20"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 60%, transparent 100%)",
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-zinc-700/40" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-zinc-700/40" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-zinc-700/20" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-zinc-700/20" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end gap-8">
          {/* Left: Main heading */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-zinc-600 font-mono text-xs tracking-widest status-pulse">&gt;</span>
              <span className="text-gray-600 font-mono text-xs tracking-widest uppercase">
                VR Headset ADB Command Reference
              </span>
            </div>

            <h2 className="font-display font-black text-white leading-none tracking-tight mb-1"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              THE FASTEST WAY TO
            </h2>
            <h2 className="font-display font-black leading-none tracking-tight mb-4 text-glow-red"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                  color: "#FFFFFF",
                  letterSpacing: "0.05em",
                }}>
              ADB YOUR VR
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md font-mono">
              The full ADB archive for Meta Quest, Pico &amp; Android VR — every command in the Horizon OS v2.9.0 firmware, plus the curated essentials below.
              Click <span className="text-zinc-500 font-bold">COPY</span> — paste — execute.
              No docs. No digging. Just commands.
              <br />
              <br />
              <span className="text-zinc-600 font-bold">VERY IMPORTANT</span>
              <br />
              <span className="text-zinc-500">DISCORD SERVER:</span> <a href="https://discord.gg/r7SgjdmUF5" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-300 underline">https://discord.gg/r7SgjdmUF5</a>
              <br />
              <span className="text-gray-600 text-xs">JOIN TO GET MORE. Website by jinn00898 · the full 17,683-command archive was extracted from the Horizon OS v2.9.0 firmware by FluxDev · goobert / sing / ace for the original ADB commands</span>
            </p>
          </div>

          {/* Right: Archive panel */}
          <div className="lg:w-96 rounded border border-zinc-900/30 bg-black/70 backdrop-blur-sm overflow-hidden
                          shadow-[0_0_30px_rgba(255,255,255,0.08)]">
            <div className="p-6">
              <div className="font-display font-black text-white leading-none" style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}>
                {archiveCount.toLocaleString()}
              </div>
              <div className="mt-1 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400">
                commands in the archive
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-500 font-mono">
                Every ADB property in the Horizon OS v2.9.0 firmware — pulled
                straight from the system image, not scraped from other lists.
              </p>
              <Link
                href="/archive"
                className="mt-4 inline-flex items-center gap-2 rounded border border-zinc-800/40 bg-zinc-950/20 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:border-zinc-600/60 hover:text-zinc-100"
              >
                <Database size={12} />
                Browse the archive
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Page ── */
export default function Home() {
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
      <header className="relative z-10 border-b border-zinc-900/25 bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Logo mark */}
          <div className="flex items-center gap-3 flex-shrink-0 cursor-pointer select-none" onClick={handleLogoClick} title="NovaADBs">
            <div
              className="w-10 h-10 rounded border border-zinc-700/50 bg-zinc-950/30 flex items-center justify-center"
              style={{ boxShadow: "0 0 16px rgba(255,255,255,0.25), inset 0 0 8px rgba(255,255,255,0.05)" }}
            >
              <img
                src="/manus-storage/logo_93b0e9cb.png"
                alt=""
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  const fallback = el.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span className="text-zinc-500 font-mono text-lg font-bold hidden">&gt;_</span>
            </div>
            <div>
              <div className="font-display text-sm font-black text-white tracking-widest leading-none">
                NOVA<span className="text-white">ADBS</span>
              </div>
              <div className="text-[9px] text-gray-700 tracking-[0.2em] uppercase leading-none mt-0.5 font-mono">
                For Quest, Pico &amp; Android VR
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Header nav */}
          <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-700 font-mono">
            <Link href="/archive" className="inline-flex items-center gap-1.5 rounded border border-zinc-800/35 bg-zinc-950/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:border-zinc-600/60 hover:text-zinc-300 transition-colors">
              <Database size={10} />
              LIST
            </Link>
            <Link href="/calendar" className="inline-flex items-center gap-1.5 rounded border border-zinc-800/35 bg-zinc-950/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:border-zinc-600/60 hover:text-zinc-300 transition-colors">
              <CalendarDays size={10} />
              CALENDAR
            </Link>
            <Link href="/help" className="inline-flex items-center gap-1.5 rounded border border-zinc-800/35 bg-zinc-950/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:border-zinc-600/60 hover:text-zinc-300 transition-colors">
              <Shield size={10} />
              HELP
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO BOOT SEQUENCE ── */}
      <HeroBoot />

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
            <span className="tracking-widest">NovaADBs v1.2.0</span>
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
