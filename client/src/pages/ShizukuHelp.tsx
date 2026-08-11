import { Link } from "wouter";
import { ArrowLeft, Download, ShieldCheck, Smartphone, Settings, Rocket, ExternalLink, CheckCircle2, MonitorCog, Wifi, TerminalSquare } from "lucide-react";
import ShootingStars from "@/components/ShootingStars";

const setupSteps = [
  {
    title: "1) Install Shizuku 11.0 first",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Start with the older 11.0 release instead of jumping straight to the newest version. On Meta Quest devices, the goal is to get the basic pairing flow working first, then update once the device can connect cleanly.</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Download the 11.0 APK from the official GitHub release page.</li>
          <li>Allow installation from unknown sources if the headset prompts for it.</li>
          <li>Do not install the newest Shizuku yet unless the 11.0 version is already working.</li>
        </ul>
      </div>
    ),
    action: "https://github.com/RikkaApps/Shizuku/releases",
    actionLabel: "GET SHIZUKU 11.0 APK",
    icon: Download,
  },
  {
    title: "2) Enable Meta Quest developer options",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>On the Quest, go to Settings and enable the developer features before you try any ADB or Shizuku pairing.</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Settings → About → Software version</li>
          <li>Tap the version/build number repeatedly until developer mode unlocks</li>
          <li>Then open Settings → Developer and turn on USB debugging</li>
          <li>Also check that unknown app installs are allowed if the APK installer asks for it</li>
        </ul>
      </div>
    ),
    action: "https://www.google.com/search?q=meta+quest+enable+developer+mode+usb+debugging",
    actionLabel: "GOOGLE THE QUEST DEV MODE STEPS",
    icon: MonitorCog,
  },
  {
    title: "3) Use Lightning Launcher to fix the Android settings flow",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>If the headset UI is awkward or the settings app is hard to reach, install Lightning Launcher and temporarily use it as the home app so the Android app/system settings screen is easier to access.</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Install Lightning Launcher from the APK or app store source you trust.</li>
          <li>Set it as the default launcher temporarily if needed.</li>
          <li>Use it to navigate to system settings, apps, and permissions without the launcher breaking the flow.</li>
          <li>Once the device is set up, you can switch back if you want.</li>
        </ul>
      </div>
    ),
    action: "https://www.google.com/search?q=lightning+launcher+meta+quest+setup",
    actionLabel: "GOOGLE LIGHTNING LAUNCHER SETUP",
    icon: Smartphone,
  },
  {
    title: "4) Pair Shizuku with the Quest",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Open the Shizuku 11.0 app and follow the pairing flow. On Meta Quest builds, the app usually wants either ADB pairing or a working device connection first.</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Connect the headset to a PC with ADB if your setup requires it.</li>
          <li>Use the Shizuku app’s onboarding flow to grant the requested permissions.</li>
          <li>Allow the app to start the daemon/service if the headset asks for it.</li>
          <li>Keep Shizuku running while you use the ADB tools.</li>
        </ul>
      </div>
    ),
    action: "https://shizuku.rikka.app/",
    actionLabel: "OPEN OFFICIAL SHIZUKU GUIDE",
    icon: ShieldCheck,
  },
  {
    title: "5) Optional PC-side ADB pairing flow",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>If you are doing the more advanced setup on a PC, use this flow to make sure the headset is visible to ADB before starting Shizuku.</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Install ADB tools on the PC and confirm they are working.</li>
          <li>Run: adb devices to check the Quest is visible.</li>
          <li>If needed, use adb pair and adb connect with the Quest IP and port.</li>
          <li>After the device connects, launch the Shizuku app and finish the final permission prompts.</li>
        </ul>
      </div>
    ),
    action: "https://www.google.com/search?q=adb+pair+meta+quest+setup+shizuku",
    actionLabel: "GOOGLE QUEST ADB PAIRING",
    icon: Wifi,
  },
  {
    title: "6) Upgrade after it works",
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Once the 11.0 installation is stable and ADB/Shizuku is functioning, update to the newest Shizuku release. This keeps the setup clean and avoids the common issue of upgrading before the base flow works.</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Update only after the headset can pair and connect.</li>
          <li>Re-open Shizuku and check that permissions still match.</li>
          <li>If the app breaks after the upgrade, reinstall the working 11.0 APK and re-run the setup.</li>
        </ul>
      </div>
    ),
    action: "https://github.com/RikkaApps/Shizuku/releases/latest",
    actionLabel: "GET THE LATEST SHIZUKU",
    icon: Rocket,
  },
];

const quickNotes = [
  "Use the 11.0 APK first. Do not start with the newest build when the Quest setup is still unstable.",
  "Enable developer mode and USB debugging before anything else. Without that, Shizuku will not pair correctly.",
  "If the Quest UI blocks normal settings access, use Lightning Launcher to simplify the navigation flow and reach the needed app permissions.",
  "After the base setup works, upgrade to the newest Shizuku version and verify the pairing still works.",
  "If your build differs, Google the exact Quest model + Android version + Shizuku phrase for your specific steps.",
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
              Meta Quest <span className="text-red-500">Shizuku</span> Guide
            </h1>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-gray-400 font-mono">
            This is the cleanest order for Meta Quest builds: install Shizuku 11.0 APK first, enable developer mode and USB debugging, use Lightning Launcher to help with Android settings navigation if needed, pair the headset, then upgrade to the newest version only after the base setup is confirmed working.
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

              <div className="mb-4">{body}</div>

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
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-white">Quick checklist</h3>
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

        <div className="mt-8 rounded border border-red-900/30 bg-black/60 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <TerminalSquare className="text-red-500" size={16} />
            <h3 className="font-display text-xs uppercase tracking-[0.2em] text-white">Helpful command reminder</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 font-mono">
            If you are pairing from a PC, the usual flow is: install ADB, verify the headset shows up with <span className="text-red-400">adb devices</span>, then use the recommended pairing/connect commands in the official Shizuku docs before you start the app itself.
          </p>
        </div>
      </div>
    </div>
  );
}
