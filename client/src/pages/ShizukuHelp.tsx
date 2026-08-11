import { Link } from "wouter";
import { ArrowLeft, Download, ShieldCheck, Smartphone, Settings, Rocket, ExternalLink, CheckCircle2 } from "lucide-react";
import ShootingStars from "@/components/ShootingStars";

const setupSteps = [
  {
    title: "1) Install the correct Shizuku version",
    body:
      "Use the 11.0 Shizuku APK from the official project page first. This is the easiest version to get working on older Android/Quest-based setups before you upgrade later.",
    action: "https://github.com/RikkaApps/Shizuku/releases",
    actionLabel: "GET SHIZUKU 11.0 APK",
    icon: Download,
  },
  {
    title: "2) Set up Android settings for the launcher flow",
    body:
      "Open Android settings, allow apps to install unknown sources if needed, and use Lightning Launcher or a similar launcher setup to help the device expose the required app/access flow cleanly before continuing.",
    action: "https://www.google.com/search?q=lightning+launcher+android+setup+shizuku",
    actionLabel: "GOOGLE THE LIGHTNING LAUNCHER STEPS",
    icon: Smartphone,
  },
  {
    title: "3) Complete the Shizuku pairing + permissions",
    body:
      "Once the app is installed, open Shizuku, follow the device pairing flow, grant the permissions it requests, and keep the app running while you use the ADB tools.",
    action: "https://shizuku.rikka.app/",
    actionLabel: "OPEN OFFICIAL SHIZUKU GUIDE",
    icon: ShieldCheck,
  },
  {
    title: "4) Upgrade after it works",
    body:
      "After the basic setup succeeds, you can upgrade to the newest Shizuku version and re-run the pairing steps. The goal is to get the device working first, then update it once the base configuration is stable.",
    action: "https://github.com/RikkaApps/Shizuku/releases/latest",
    actionLabel: "GET THE LATEST SHIZUKU",
    icon: Rocket,
  },
];

const quickNotes = [
  "Use the older 11.0 APK first so the base flow works cleanly.",
  "Lightning Launcher can help with the Android-side setup flow if your launcher config is blocking the app access.",
  "After setup is confirmed, upgrade to the newest Shizuku and recheck permissions.",
  "If a step fails, Google the exact Android version and launcher name for the current device instructions.",
];

export default function ShizukuHelp() {
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

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2 rounded border border-red-800/35 bg-red-950/20 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:border-red-600/60 hover:text-red-300 transition-colors">
            <ArrowLeft size={12} />
            BACK TO HOME
          </Link>
          <div className="text-[10px] uppercase tracking-[0.3em] text-gray-700 font-mono">
            SHIZUKU SETUP
          </div>
        </div>

        <div className="mb-8 rounded border border-red-900/30 bg-black/60 p-6 shadow-[0_0_30px_rgba(220,38,38,0.08)] backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="text-red-500" size={18} />
            <h1 className="font-display text-2xl sm:text-3xl font-black tracking-[0.12em] uppercase text-white">
              How to use <span className="text-red-500">Shizuku</span>
            </h1>
          </div>

          <p className="max-w-3xl text-sm leading-relaxed text-gray-400 font-mono">
            If you are setting up Shizuku on an Android-based VR device, use the 11.0 APK first, confirm the Android launcher/settings flow using Lightning Launcher, then upgrade to the newest version after the basics are working.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {setupSteps.map(({ title, body, action, actionLabel, icon: Icon }) => (
            <div
              key={title}
              className="relative rounded border border-red-900/25 bg-white/[0.02] backdrop-blur-sm overflow-hidden card-glow p-5"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600 via-red-700 to-transparent opacity-60" />
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="rounded border border-red-800/35 bg-red-950/20 p-2 text-red-400">
                    <Icon size={14} />
                  </div>
                  <h2 className="font-display text-xs uppercase tracking-[0.2em] text-red-400">
                    {title}
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-gray-400 font-mono mb-4">{body}</p>

              <a
                href={action}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-red-800/35 bg-red-950/20 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-red-300 transition-colors hover:border-red-600/60 hover:text-red-200"
              >
                <ExternalLink size={12} />
                {actionLabel}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded border border-red-900/30 bg-black/60 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-red-500" size={16} />
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-white">Quick notes</h3>
          </div>

          <ul className="space-y-3">
            {quickNotes.map((note) => (
              <li key={note} className="flex items-start gap-3 text-sm text-gray-400 font-mono leading-relaxed">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
