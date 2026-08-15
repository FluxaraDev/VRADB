/**
 * Home — VR ADB Command Key Mapper
 * Crimson Terminal: pure black, CRT scanlines, red shooting stars, boot-sequence hero,
 * monospace command cards with copy-to-clipboard.
 *
 * Style: Crimson Terminal — war-room console for VR power users.
 * Colors: #000 bg, #dc2626 brand red, #09bb3c glow, #22C55E code syntax (secondary only)
 * Fonts: Orbitron (display), JetBrains Mono (body/code)
 */
import { useState, useCallback, useEffect, useRef } from "react";
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
  Activity,
  Shield,
  Database,
  CalendarDays,
} from "lucide-react";
import ShootingStars from "@/components/ShootingStars";
import { adbCategories, type AdbCommand, type AdbCategory } from "@/data/adbCommands";

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

/* ── Boot sequence text hook ── */
function useBootText(lines: string[], intervalMs = 400) {
  const [visibleCount, setVisibleCount] = useState(0);
  useEffect(() => {
    if (visibleCount >= lines.length) return;
    const t = setTimeout(() => setVisibleCount((n) => n + 1), intervalMs);
    return () => clearTimeout(t);
  }, [visibleCount, lines.length, intervalMs]);
  return lines.slice(0, visibleCount);
}

/* ── Command Card ── */
export function CommandCard({ cmd }: { cmd: AdbCommand }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cmd.command);
      setCopied(true);
      toast.success("COMMAND COPIED TO CLIPBOARD", {
        description: `> ${cmd.command}`,
        duration: 1800,
        style: {
          background: "#000902",
          border: "1px solid #DC2626",
          color: "#f1f5f9",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
        },
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("COPY FAILED — SELECT AND COPY MANUALLY");
    }
  }, [cmd]);

  return (
    <div
      className="group relative rounded border border-red-900/25 bg-white/[0.02] backdrop-blur-sm
                 hover:border-red-600/55 hover:bg-white/[0.035] transition-all duration-200
                 overflow-hidden card-glow"
    >
      {/* Red left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600 via-red-700 to-transparent
                      opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Corner bracket top-right */}
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-red-800/40 group-hover:border-red-600/60 transition-colors" />
      <div className="absolute bottom-0 left-3 w-3 h-3 border-b border-l border-red-800/20 group-hover:border-red-600/30 transition-colors" />

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
                      bg-gradient-to-br from-red-900/8 via-transparent to-transparent pointer-events-none" />

      <div className="p-4 pl-5">
        {/* Label + copy button */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-xs font-bold text-red-400 font-display tracking-widest leading-tight uppercase">
            {cmd.label}
          </h3>
          <button
            onClick={handleCopy}
            aria-label="Copy command"
            className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-display
                       border transition-all duration-150 active:scale-95 tracking-widest uppercase
                       border-red-800/40 text-red-600 hover:border-red-500 hover:text-white
                       hover:bg-red-600/15 hover:shadow-[0_0_12px_rgba(220,38,38,0.25)]"
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
        <div className="relative mb-2.5 rounded bg-black border border-red-900/15 px-3 py-2 overflow-x-auto
                        group-hover:border-red-900/30 transition-colors">
          <code className="text-xs text-green-500 whitespace-nowrap font-mono leading-relaxed">
            <span className="text-red-700 select-none mr-1.5 font-bold">$</span>
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
            ? "bg-red-600/15 text-red-400 border border-red-600/35 shadow-[0_0_8px_rgba(220,38,38,0.1)]"
            : "text-gray-500 hover:text-red-400 hover:bg-red-900/8 border border-transparent"
          }`}
      >
        <Zap size={12} className={activeId === null ? "text-red-500" : "text-gray-700"} />
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
                ? "bg-red-600/15 text-red-400 border border-red-600/35 shadow-[0_0_8px_rgba(220,38,38,0.1)]"
                : "text-gray-500 hover:text-red-400 hover:bg-red-900/8 border border-transparent"
              }`}
          >
            <Icon size={12} className={isActive ? "text-red-500" : "text-gray-700"} />
            <span className="flex-1 font-display tracking-widest text-[10px] uppercase">{cat.name}</span>
            <span className="text-[10px] text-gray-700 tabular-nums font-mono">{counts[cat.id] ?? 0}</span>
            {isActive && <ChevronRight size={10} className="text-red-700" />}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Status Bar ── */
function StatusBar() {
  const [time, setTime] = useState(() => new Date().toLocaleTimeString("en-US", { hour12: false }));
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => clearInterval(t);
  }, []);
  const total = adbCategories.reduce((s, c) => s + c.commands.length, 0);

  return (
    <div className="flex items-center gap-4 text-[10px] font-mono text-gray-700 border-b border-red-900/15 px-4 py-1.5
                    bg-black/90">
      <span className="text-red-800 status-pulse">■ SYSTEM ONLINE</span>
      <span className="text-gray-800">|</span>
      <span>ADB_LIB v2.6.1</span>
      <span className="text-gray-800">|</span>
      <span><span className="text-red-700">{total}</span> CMDS LOADED</span>
      <span className="text-gray-800">|</span>
      <span><span className="text-red-700">{adbCategories.length}</span> MODULES</span>
      <div className="flex-1" />
      <span>SYS_TIME: <span className="text-red-700">{time}</span></span>
      <span className="text-gray-800">|</span>
      <span>TARGET: <span className="text-red-700">VR_HEADSET</span></span>
    </div>
  );
}

/* ── Hero Boot Sequence ── */
function HeroBoot() {
  const bootLines = [
    "> CONNECTING TO ADB BRIDGE...",
    "> DEVICE DETECTED: VR_HEADSET [AUTHORIZED]",
    "> LOADING COMMAND LIBRARY... [50/50 CMDS]",
    "> ALL SYSTEMS NOMINAL. READY TO EXECUTE.",
  ];
  const visible = useBootText(bootLines, 500);

  return (
    <section
      className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 border-b border-red-900/20"
      style={{
        background: "linear-gradient(180deg, rgba(220,38,38,0.06) 0%, rgba(220,38,38,0.02) 60%, transparent 100%)",
      }}
    >
      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-red-700/40" />
      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-red-700/40" />
      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-red-700/20" />
      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-red-700/20" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end gap-8">
          {/* Left: Main heading */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-red-600 font-mono text-xs tracking-widest status-pulse">&gt;</span>
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
                  color: "#DC2626",
                  letterSpacing: "0.05em",
                }}>
              ADB YOUR VR
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-md font-mono">
              50 curated ADB commands for Meta Quest, Pico &amp; Android VR.
              Click <span className="text-red-500 font-bold">COPY</span> — paste — execute.
              No docs. No digging. Just commands.
              <br />
              <br />
              <span className="text-red-600 font-bold">VERY IMPORTANT</span>
              <br />
              <span className="text-red-500">DISCORD SERVER:</span> <a href="https://discord.gg/r7SgjdmUF5" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 underline">https://discord.gg/r7SgjdmUF5</a>
              <br />
              <span className="text-gray-600 text-xs">JOIN TO GET MORE. Credits to jinn00898 for the website and FluxDev for small tweaks. / goobert / sing / ace for most of the ADB commands</span>
            </p>
          </div>

          {/* Right: Boot terminal */}
          <div className="lg:w-96 rounded border border-red-900/30 bg-black/70 backdrop-blur-sm overflow-hidden
                          shadow-[0_0_30px_rgba(220,38,38,0.08)]">
            {/* Terminal title bar */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-red-900/20 bg-red-950/20">
              <div className="w-2 h-2 rounded-full bg-red-700" />
              <div className="w-2 h-2 rounded-full bg-red-900/50" />
              <div className="w-2 h-2 rounded-full bg-red-900/30" />
              <span className="ml-2 text-[10px] text-gray-700 font-mono tracking-widest uppercase">
                adb_mapper — bash
              </span>
            </div>
            {/* Boot output */}
            <div className="p-4 min-h-[120px] font-mono text-xs">
              {visible.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`mb-1 ${i === visible.length - 1 && visible.length === bootLines.length
                    ? "text-green-500"
                    : "text-gray-400"
                  }`}
                >
                  {line}
                </motion.div>
              ))}
              {visible.length < bootLines.length && (
                <span className="text-red-600 cursor-blink">█</span>
              )}
              {visible.length === bootLines.length && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-red-600">$</span>
                  <span className="text-gray-300">_</span>
                  <span className="text-red-600 cursor-blink">█</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Page ── */
export default function Home() {
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
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden crt-scanlines crt-noise">
      {/* Animated shooting stars background */}
      <ShootingStars />

      {/* Radial red glow at top */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 35% at 50% 0%, rgba(220,38,38,0.09) 0%, transparent 70%)",
        }}
      />

      {/* ── STATUS BAR ── */}
      <div className="relative z-10">
        <StatusBar />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 border-b border-red-900/25 bg-black/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
          {/* Logo mark */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-10 h-10 rounded border border-red-700/50 bg-red-950/30 flex items-center justify-center"
              style={{ boxShadow: "0 0 16px rgba(220,38,38,0.25), inset 0 0 8px rgba(220,38,38,0.05)" }}
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
              <span className="text-red-500 font-mono text-lg font-bold hidden">&gt;_</span>
            </div>
            <div>
              <div className="font-display text-sm font-black text-white tracking-widest leading-none">
                NOVA<span className="text-red-500">ADBS</span>
              </div>
              <div className="text-[9px] text-gray-700 tracking-[0.2em] uppercase leading-none mt-0.5 font-mono">
                For Quest, Pico &amp; Android VR
              </div>
            </div>
          </div>

          {/* Boot text */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <span className="text-red-700 text-xs font-mono status-pulse">&gt;_</span>
            <span className="text-gray-700 text-[10px] font-mono tracking-widest uppercase">
              ADB COMMAND LIBRARY — LOADED
            </span>
          </div>

          <div className="flex-1" />

          {/* Header stats */}
          <div className="hidden sm:flex items-center gap-5 text-[10px] text-gray-700 font-mono">
            <div className="flex items-center gap-1.5">
              <Activity size={10} className="text-red-800" />
              <span>
                <span className="text-red-600 font-bold">
                  {adbCategories.reduce((s, c) => s + c.commands.length, 0)}
                </span>{" "}
                COMMANDS
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield size={10} className="text-red-800" />
              <span>
                <span className="text-red-600 font-bold">{adbCategories.length}</span> MODULES
              </span>
            </div>
            <Link href="/archive" className="inline-flex items-center gap-1.5 rounded border border-red-800/35 bg-red-950/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:border-red-600/60 hover:text-red-300 transition-colors">
              <Database size={10} />
              LIST
            </Link>
            <Link href="/calendar" className="inline-flex items-center gap-1.5 rounded border border-red-800/35 bg-red-950/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:border-red-600/60 hover:text-red-300 transition-colors">
              <CalendarDays size={10} />
              CALENDAR
            </Link>
            <Link href="/help" className="inline-flex items-center gap-1.5 rounded border border-red-800/35 bg-red-950/20 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:border-red-600/60 hover:text-red-300 transition-colors">
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
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-red-900/20">
                <span className="text-red-700 text-[10px] font-mono">&gt;</span>
                <span className="text-[9px] text-gray-700 font-display tracking-widest uppercase">
                  Module Select
                </span>
              </div>

              {/* Search */}
              <div className="relative mb-3">
                <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-700" />
                <input
                  type="text"
                  placeholder="SEARCH_CMDS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-black border border-red-900/25 rounded pl-7 pr-3 py-1.5
                             text-[11px] text-gray-400 placeholder-gray-800 font-mono tracking-wide
                             focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20
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
              <div className="mt-6 pt-3 border-t border-red-900/15">
                <p className="text-[9px] text-gray-800 font-mono leading-relaxed">
                  ENABLE USB DEBUGGING BEFORE RUNNING ANY ADB COMMAND.
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
                placeholder="SEARCH_CMDS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black border border-red-900/25 rounded pl-7 pr-3 py-1.5
                           text-[11px] text-gray-400 placeholder-gray-800 font-mono tracking-wide
                           focus:outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20
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
                        ? "bg-red-600/15 text-red-400 border-red-600/35"
                        : "text-gray-600 border-red-900/15 hover:text-red-400 hover:border-red-800/30"
                      }`}
                  >
                    {cat.name}
                  </button>
                )
              )}
            </div>

            {/* Results prompt line */}
            <div className="flex items-center justify-between mb-5 pb-2 border-b border-red-900/15">
              <div className="flex items-center gap-2">
                <span className="text-red-700 font-mono text-xs status-pulse">&gt;</span>
                <span className="text-gray-600 text-[11px] font-mono uppercase tracking-widest">
                  {search
                    ? `QUERY "${search.toUpperCase()}" — ${totalVisible} RESULT${totalVisible !== 1 ? "S" : ""}`
                    : activeCategory
                    ? `MODULE: ${adbCategories.find((c) => c.id === activeCategory)?.name.toUpperCase()}`
                    : "ALL MODULES — DISPLAYING ALL COMMANDS"}
                </span>
              </div>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[10px] text-gray-700 hover:text-red-500 transition-colors font-mono tracking-widest"
                >
                  [CLEAR_QUERY]
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
                  <Terminal size={28} className="mx-auto mb-4 text-red-900/30" />
                  <p className="text-gray-700 tracking-widest">NO COMMANDS MATCH QUERY</p>
                  <p className="text-gray-800 mt-1">ADJUST SEARCH PARAMETERS AND RETRY</p>
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
                            <span className="text-red-800 font-mono text-[10px]">&gt;</span>
                            <Icon size={13} className="text-red-600" />
                            <h2 className="font-display text-xs font-bold text-white tracking-[0.2em] uppercase">
                              {cat.name}
                            </h2>
                          </div>
                          <div className="flex-1 h-px bg-gradient-to-r from-red-900/30 to-transparent" />
                          <span className="text-[10px] text-gray-700 font-mono tabular-nums">
                            [{cat.commands.length.toString().padStart(2, "0")}]
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
      <footer className="relative z-10 border-t border-red-900/20 mt-4 py-5 px-4 bg-black/80">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[10px] text-gray-700 font-mono">
            <span className="text-red-700">&gt;_</span>
            <span className="tracking-widest">Nova ADB's v2.6.1</span>
          </div>
          <p className="text-[10px] text-gray-800 font-mono text-center tracking-wide">
            ⚠ USE AT YOUR OWN RISK — ENABLE USB DEBUGGING BEFORE EXECUTING ANY ADB COMMAND
          </p>
          <div className="flex items-center gap-2 text-[10px] text-gray-800 font-mono">
            <span className="text-red-900 status-pulse">■</span>
            <span>SYSTEM READY</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
