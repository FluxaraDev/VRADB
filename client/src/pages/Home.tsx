/**
 * Home — Nova Modding hub (v2.0.0).
 * The front door is Nova Modding: Nova Client, the tools list, and the
 * Terms of Service. The ADB archive lives on its own pages (/commands,
 * /archive) — backgrounded, not removed.
 */
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { toast } from "sonner";
import { Link } from "wouter";
import {
  Download,
  ExternalLink,
  ArrowRight,
  Ticket,
  Play,
  Wrench,
  FileText,
  Database,
  Shield,
  Gamepad2,
  List,
} from "lucide-react";
import ShootingStars from "@/components/ShootingStars";
import { getArchiveEntries } from "@/lib/adbArchive";

const INVITE = "https://discord.gg/novamodding";
const CLIENT_FREE_URL =
  "https://www.mediafire.com/file/vs04jmqm0pazt9g/libNovaClientFree.so/file";
const LOAD_SNIPPET =
  'const-string v0, "NovaClientFree"\n\ninvoke-static {v0}, Ljava/lang/System;->loadLibrary(Ljava/lang/String;)V';

/* ── Nova Client V3 menus ── */
const CLIENT_MENUS: { title: string; items: string[] }[] = [
  {
    title: "Settings",
    items: [
      "Right Hand Menu",
      "Notifications",
      "Disconnect Button",
      "Disable Rounded Menu",
    ],
  },
  {
    title: "Movement",
    items: [
      "Platforms",
      "Up And Down",
      "Nebula Platforms",
      "NoClip",
      "PSA",
      "Pull Mod",
      "Head Fly",
      "Controller Fly",
      "Bark Fly",
      "Thumbstick Fly",
      "Long Arms+",
      "Long Arms",
      "Short Arms",
      "Low Gravity",
      "Zero Gravity",
      "Fix Gravity",
      "Walk On Walls",
      "Spider Climb",
      "Infinite Jump",
      "Excel Fly",
      "Teleport Gun",
    ],
  },
  { title: "Soundboard", items: ["Reload", "Stop Sounds"] },
  {
    title: "Public Mods",
    items: [
      "Tag Gun",
      "Rig Gun",
      "Slow Gun",
      "Hide Player ID",
      "CS Cosmetics",
      "Strobe Monke",
      "RGB Monke",
    ],
  },
];

/* ── Tools (from the Nova tools channel) ── */
const TOOLS: { name: string; desc: string; href: string }[] = [
  {
    name: "UABEA",
    desc: "Unity asset bundle extractor and editor.",
    href: "https://github.com/nesrak1/UABEA/releases/tag/v8",
  },
  {
    name: "jadx",
    desc: "DEX to Java decompiler for APKs.",
    href: "https://github.com/skylot/jadx/releases/tag/v1.5.1",
  },
  {
    name: "dnSpy",
    desc: ".NET assembly editor and debugger.",
    href: "https://github.com/dnSpy/dnSpy/releases/tag/v6.1.8",
  },
  {
    name: "APK Toolkit",
    desc: "Decompile and rebuild APKs on Windows.",
    href: "https://xdaforums.com/t/tool-apk-toolkit-v1-5-windows.4572881/",
  },
  {
    name: "APK Easy Tool",
    desc: "A simple GUI front-end for apktool.",
    href: "https://apk-easy-tool.en.lo4d.com/windows",
  },
  {
    name: "HxD",
    desc: "Hex editor for Windows.",
    href: "https://mh-nexus.de/en/downloads.php?product=HxD20",
  },
  {
    name: "Android Studio",
    desc: "The official Android IDE.",
    href: "https://developer.android.com/studio",
  },
  {
    name: "DownQ",
    desc: "Chrome extension from the Nova tools channel.",
    href: "https://chromewebstore.google.com/detail/downq/clocmpojdjmikkaepgkmplgooejmnchb",
  },
];

/* ── Section heading ── */
function SectionHead({
  kicker,
  title,
  icon,
}: {
  kicker: string;
  title: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-zinc-500">{icon}</span>
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500">
          {kicker}
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight">
          {title}
        </h2>
      </div>
      <div className="flex-1 h-px bg-zinc-900 ml-2" />
    </div>
  );
}

/* ── Discord mention pill (opens through the join gate) ── */
function MentionPill({
  label,
  url,
  onContact,
}: {
  label: string;
  url: string;
  onContact: (url: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onContact(url)}
      className="inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded bg-[#5865F2]/25 text-[#B7BBFF] border border-[#5865F2]/40 hover:bg-[#5865F2]/45 transition-colors text-[13px] font-semibold cursor-pointer align-baseline"
    >
      {label}
    </button>
  );
}

/* ── Terms of Service ── */
function TermsSection({
  gate,
  onContact,
  onGateAnswer,
}: {
  gate: string | null;
  onContact: (url: string) => void;
  onGateAnswer: (joined: boolean) => void;
}) {
  const sec = "font-display text-sm font-bold text-white mt-6 mb-1.5";
  const body = "text-sm text-zinc-400 leading-relaxed";
  return (
    <div className="rounded border border-zinc-800 bg-zinc-950/60 p-5 sm:p-7">
      <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono tracking-[0.25em] uppercase">
        <FileText size={12} /> Effective Date: February 28, 2026
      </div>

      <h3 className={sec}>1. Eligibility</h3>
      <p className={body}>
        You must be at least 13 years old to use NOVA. You agree to follow
        Discord's Terms of Service and provide any required information.
      </p>

      <h3 className={sec}>2. The Service</h3>
      <p className={body}>
        NOVA provides modifications (mods) for VR games. We may change,
        suspend, or discontinue any part of the service at any time if it's not
        working.
      </p>

      <h3 className={sec}>3. No Refunds</h3>
      <p className={body}>
        <strong className="text-zinc-200">All sales are final.</strong> NOVA
        does not offer refunds or credits for any reason, including
        dissatisfaction, accidental purchase, downtime, or account termination.
      </p>

      <h3 className={sec}>4. Your Content</h3>
      <p className={body}>
        You keep ownership of any content or data you submit. By using NOVA,
        you grant us a royalty-free license to host, store, process, and use
        that data solely to operate and improve the service.
      </p>

      <h3 className={sec}>5. Data Removal</h3>
      <p className={body}>
        You can request deletion of your data by contacting an administrator or
        owner. We will handle it promptly.
      </p>

      <h3 className={sec}>6. Termination</h3>
      <p className={body}>
        You may stop using NOVA at any time. We may suspend or terminate your
        access if you violate these terms, share paid products outside the
        server, leak private information, or for any other reasonable cause.
      </p>

      <h3 className={sec}>7. Contact</h3>
      <p className={body}>
        Message NOVA privately on Discord for any questions — meaning only
        message
        <MentionPill
          label="@Nova"
          url="https://discord.com/users/995929873568768050"
          onContact={onContact}
        />
        or
        <MentionPill
          label="@LO"
          url="https://discord.com/users/1482188544046010511"
          onContact={onContact}
        />
        . Or DM
        <MentionPill
          label="@.org"
          url="https://discord.com/users/1564406880418402347"
          onContact={onContact}
        />
        , or you could simply create a
        <MentionPill
          label="# 🎟️ tickets"
          url="https://discord.com/channels/1527163529826930728/1562101092802625647"
          onContact={onContact}
        />
        .
      </p>

      {gate && (
        <div className="mt-5 rounded border border-[#5865F2]/40 bg-[#5865F2]/10 px-4 py-3 flex flex-wrap items-center gap-3">
          <span className="text-sm text-zinc-200 font-medium">
            Did you join our Discord?
          </span>
          <button
            type="button"
            onClick={() => onGateAnswer(true)}
            className="px-3.5 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => onGateAnswer(false)}
            className="px-3.5 py-1.5 rounded border border-zinc-600 text-zinc-200 text-xs font-bold hover:border-zinc-400 transition-colors cursor-pointer"
          >
            No — take me there
          </button>
        </div>
      )}
    </div>
  );
}

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

  const [gate, setGate] = useState<string | null>(null);
  const handleGateAnswer = useCallback(
    (joined: boolean) => {
      if (!gate) return;
      window.open(joined ? gate : INVITE, "_blank", "noopener,noreferrer");
      setGate(null);
    },
    [gate]
  );

  /* Background music (hidden audio player iframe) */
  const [audioStarted, setAudioStarted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data as Record<string, unknown> | null;
      if (!data || data.type !== "MANUS_HIDDEN_AUDIO") return;
      if (data.status === "ready") setAudioReady(true);
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);
  useEffect(() => {
    if (!audioReady || autoplayAttempted) return;
    const iframe = document.getElementById(
      "hiddenAudioIframe"
    ) as HTMLIFrameElement | null;
    const win = iframe?.contentWindow as any;
    setAutoplayAttempted(true);
    if (win?.tryAutoplay) {
      win.tryAutoplay().then(() => setAudioStarted(true)).catch(() => {});
    }
  }, [audioReady, autoplayAttempted]);
  const handleStartAudio = useCallback(() => {
    setAudioStarted(true);
    const iframe = document.getElementById(
      "hiddenAudioIframe"
    ) as HTMLIFrameElement | null;
    const win = iframe?.contentWindow as any;
    if (win?.playHiddenAudio) {
      win.playHiddenAudio().catch(() => {});
    } else if (audioReady) {
      iframe?.contentWindow?.postMessage(
        { type: "MANUS_HIDDEN_AUDIO", action: "play" },
        "*"
      );
    }
  }, [audioReady]);

  const scrollToId = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-black text-gray-100 overflow-x-hidden">
      <ShootingStars />
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
          <div
            className="flex items-center gap-3 flex-shrink-0 cursor-pointer select-none"
            onClick={handleLogoClick}
            title="Nova Modding"
          >
            <div className="w-10 h-10 rounded overflow-hidden border border-zinc-800 flex-shrink-0">
              <img
                src="/nova-logo.svg"
                alt="Nova Modding"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-display text-sm font-black text-white tracking-widest leading-none">
                Nova <span className="text-zinc-400">Modding</span>
              </div>
              <div className="text-[9px] text-gray-600 tracking-[0.25em] uppercase leading-none mt-1 font-mono">
                VR Modding Hub
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <nav className="hidden sm:flex items-center gap-1.5">
            <button
              onClick={() => scrollToId("client")}
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors cursor-pointer"
            >
              CLIENT
            </button>
            <button
              onClick={() => scrollToId("tools")}
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors cursor-pointer"
            >
              TOOLS
            </button>
            <button
              onClick={() => scrollToId("terms")}
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors cursor-pointer"
            >
              TERMS
            </button>
            <Link
              href="/commands"
              className="px-3 py-1.5 rounded text-[10px] font-mono tracking-[0.15em] text-zinc-400 hover:text-zinc-200 hover:border-zinc-700/60 border border-transparent transition-colors"
            >
              ADB LIST
            </Link>
          </nav>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10 sm:pt-16">
        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-zinc-800 bg-zinc-950/70 text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-400 mb-5">
              <Gamepad2 size={11} className="text-zinc-500" />
              VR Modding Hub
            </div>
            <h1 className="font-display text-5xl sm:text-7xl font-black leading-[0.95] text-white">
              NOVA
              <br />
              <span className="text-zinc-500">MODDING</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl">
              Mods and libraries for VR fangames — home of Nova Client. Built
              for Gorilla Tag copies and fan games, not the official game.
            </p>
            <div className="mt-5 inline-block rounded border border-zinc-700/70 bg-zinc-950/80 px-3.5 py-2.5">
              <p className="text-[11px] font-mono leading-relaxed">
                <span className="text-white font-bold">DISCORD SERVER:</span>{" "}
                <a
                  href={INVITE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white underline"
                >
                  discord.gg/novamodding
                </a>
                <span className="text-zinc-500">
                  {" "}
                  — the paid Nova Client, support and updates live there.
                </span>
              </p>
            </div>
            <p className="mt-4 text-[11px] font-mono tracking-[0.2em] uppercase text-zinc-600">
              More coming soon — this page is still being built out
            </p>
          </div>

          <div className="rounded border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="text-[10px] font-mono tracking-[0.25em] uppercase text-zinc-500 mb-1.5">
              Featured
            </div>
            <div className="font-display text-xl font-black text-white">
              Nova Client <span className="text-zinc-500">V3</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed mt-2">
              The public version is out now — movement, soundboard, spawners
              and more, for Unity 2022.3 fangames.
            </p>
            <div className="flex items-center gap-5 mt-4 text-center">
              <div>
                <div className="font-display text-lg font-black text-white">21</div>
                <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-zinc-600">
                  Movement
                </div>
              </div>
              <div>
                <div className="font-display text-lg font-black text-white">7</div>
                <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-zinc-600">
                  Public mods
                </div>
              </div>
              <div>
                <div className="font-display text-lg font-black text-white">2022.3</div>
                <div className="text-[9px] font-mono tracking-[0.15em] uppercase text-zinc-600">
                  Unity
                </div>
              </div>
            </div>
            <button
              onClick={() => scrollToId("client")}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              See Nova Client <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </section>

      {/* ── NOVA CLIENT ── */}
      <section id="client" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
        <SectionHead kicker="The Mod" title="Nova Client V3" icon={<Shield size={20} />} />

        <div className="rounded border border-zinc-800 bg-zinc-950/60 px-4 py-3 mb-6 flex items-start gap-3">
          <Shield size={15} className="text-zinc-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Nova Client is built for <span className="text-zinc-200 font-semibold">Gorilla Tag fangames and copies</span>.
            It does not work in — and is not made for — the official Gorilla Tag.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {CLIENT_MENUS.map((menu) => (
            <div key={menu.title} className="rounded border border-zinc-800 bg-zinc-950/60 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-sm font-bold text-white">{menu.title}</span>
                <span className="text-[10px] font-mono text-zinc-600">{menu.items.length}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {menu.items.map((item) => (
                  <span
                    key={item}
                    className="px-2 py-1 rounded border border-zinc-800 bg-black text-[10px] font-mono text-zinc-400"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="rounded border border-zinc-800 bg-zinc-950/60 p-5">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-display text-base font-bold text-white">Public — Free</span>
              <span className="px-1.5 py-0.5 rounded bg-white text-black text-[9px] font-bold tracking-wider uppercase">Out now</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The free public build: <span className="font-mono text-zinc-300">libNovaClientFree.so</span> for
              Unity 2022.3 fangames.
            </p>
            <a
              href={CLIENT_FREE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              <Download size={13} /> Download the .so
            </a>
            <p className="text-[11px] font-mono text-zinc-600 mt-5 mb-1.5">Load it in your mod's smali:</p>
            <pre className="rounded border border-zinc-800 bg-black px-3.5 py-3 text-[11px] leading-relaxed text-zinc-300 overflow-x-auto">{LOAD_SNIPPET}</pre>
          </div>

          <div className="rounded border border-zinc-800 bg-zinc-950/60 p-5 flex flex-col">
            <span className="font-display text-base font-bold text-white mb-1.5">Paid</span>
            <p className="text-xs text-zinc-500 leading-relaxed">
              The paid version of Nova Client is available on Discord only —
              no public download. Join the server to get it.
            </p>
            <a
              href={INVITE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto pt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded border border-zinc-600 text-zinc-100 text-xs font-bold hover:border-zinc-400 transition-colors self-start"
            >
              Join the Discord <ArrowRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* ── TOOLS ── */}
      <section id="tools" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
        <SectionHead kicker="From the tools channel" title="Modding Tools" icon={<Wrench size={20} />} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool) => (
            <a
              key={tool.name}
              href={tool.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded border border-zinc-800 bg-zinc-950/60 p-4 hover:border-zinc-600 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-display text-sm font-bold text-white">{tool.name}</span>
                <ExternalLink size={13} className="text-zinc-600 group-hover:text-zinc-300 transition-colors" />
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{tool.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* ── TERMS ── */}
      <section id="terms" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-24">
        <SectionHead kicker="The Rules" title="Terms of Service" icon={<FileText size={20} />} />
        <TermsSection gate={gate} onContact={setGate} onGateAnswer={handleGateAnswer} />
      </section>

      {/* ── ADB ARCHIVE ── */}
      <section id="adb" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SectionHead kicker="Still here" title="The ADB Archive" icon={<Database size={20} />} />
        <div className="rounded border border-zinc-800 bg-zinc-950/60 p-5 sm:p-7 grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <div className="font-display text-4xl font-black text-white">
              {archiveCount.toLocaleString()}
              <span className="text-base font-bold text-zinc-500 ml-2">commands</span>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mt-2 max-w-xl">
              The ADB side of Nova has its own pages now. The full archive —
              every property pulled from the Horizon OS v2.9.0 firmware — plus
              the curated command list, still searchable.
            </p>
            <p className="text-xs font-mono text-zinc-600 mt-3">
              Also:{" "}
              <Link href="/calendar" className="text-zinc-400 hover:text-zinc-200 underline">ADB calendar</Link>
              {" · "}
              <Link href="/help" className="text-zinc-400 hover:text-zinc-200 underline">Shizuku help</Link>
            </p>
          </div>
          <div className="flex md:flex-col gap-2.5">
            <Link
              href="/archive"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              <Database size={13} /> Browse the archive
            </Link>
            <Link
              href="/commands"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded border border-zinc-600 text-zinc-100 text-xs font-bold hover:border-zinc-400 transition-colors"
            >
              <List size={13} /> Curated commands
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-zinc-900 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-mono text-gray-700">
            <span className="tracking-widest">Nova Modding v2.0.0</span>
            {!audioStarted ? (
              <button
                onClick={handleStartAudio}
                className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer tracking-widest"
              >
                <Play size={10} /> PLAY MUSIC
              </button>
            ) : (
              <span className="tracking-widest text-zinc-500">MUSIC ON</span>
            )}
            <span>
              {archiveCount.toLocaleString()} commands in the archive
            </span>
          </div>
          <p className="text-center text-[10px] font-mono text-gray-800 leading-relaxed mt-4">
            Website by jinn00898 · the ADB archive was extracted from the
            Horizon OS v2.9.0 firmware by FluxDev · goobert / sing / ace for
            the original ADB commands
          </p>
        </div>
      </footer>
    </div>
  );
}
