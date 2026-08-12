import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Download, ShieldCheck, Smartphone, Settings, Rocket, ExternalLink, CheckCircle2, MonitorCog, Wifi, TerminalSquare, AlertTriangle, Copy, Check, ChevronDown } from "lucide-react";
import ShootingStars from "@/components/ShootingStars";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const officialSources = [
  { label: "Official Shizuku Website", url: "https://shizuku.rikka.app/" },
  { label: "Official Shizuku GitHub Releases", url: "https://github.com/RikkaApps/Shizuku/releases" },
  { label: "Android SDK Platform Tools", url: "https://developer.android.com/studio/releases/platform-tools" },
];

function CopyCodeButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 rounded border border-red-800/35 bg-red-950/20 px-2 py-1 text-[9px] uppercase tracking-[0.2em] text-red-300 transition-colors hover:border-red-600/60 hover:text-red-200"
    >
      {copied ? <Check size={10} /> : <Copy size={10} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CommandBlock({ command, title }: { command: string; title?: string }) {
  return (
    <div className="rounded border border-red-900/20 bg-black/60 p-3">
      {title ? <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-red-400">{title}</div> : null}
      <div className="mb-2 flex justify-end">
        <CopyCodeButton text={command} />
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-green-400">
        {command}
      </pre>
    </div>
  );
}

const questGuideSections = [
  {
    title: "1. WHAT THIS GUIDE DOES",
    icon: CheckCircle2,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>This guide explains:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>You MUST install Shizuku v11.0 FIRST.</li>
          <li>Pair Shizuku v11.0 using Wireless Debugging.</li>
          <li>THEN upgrade to the newest Shizuku version.</li>
          <li>How to open Android Settings using Lightning Launcher.</li>
          <li>How to unlock Developer Options using Build Number.</li>
          <li>How to enable Wireless Debugging.</li>
          <li>How pairing codes and ports work.</li>
          <li>Why you must NOT uninstall Shizuku.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2. OFFICIAL SOURCE LINKS",
    icon: ExternalLink,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>
          Official Shizuku Website: <a className="text-red-400 underline" href="https://shizuku.rikka.app/" target="_blank" rel="noopener noreferrer">https://shizuku.rikka.app/</a>
        </p>
        <p>
          Official Shizuku GitHub Releases: <a className="text-red-400 underline" href="https://github.com/RikkaApps/Shizuku/releases" target="_blank" rel="noopener noreferrer">https://github.com/RikkaApps/Shizuku/releases</a>
        </p>
        <p>
          Android SDK Platform Tools: <a className="text-red-400 underline" href="https://developer.android.com/studio/releases/platform-tools" target="_blank" rel="noopener noreferrer">https://developer.android.com/studio/releases/platform-tools</a>
        </p>
      </div>
    ),
  },
  {
    title: "3. REQUIREMENTS",
    icon: Settings,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Meta Quest headset.</li>
          <li>Developer Mode enabled in the Meta Quest app.</li>
          <li>Lightning Launcher (App Lab).</li>
          <li>Ability to install APKs directly on the headset.</li>
        </ul>
      </div>
    ),
  },
  {
    title: "4. ENABLE DEVELOPER MODE (PHONE APP)",
    icon: MonitorCog,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Open the Meta Quest app on your phone.</li>
          <li>Select your headset.</li>
          <li>Open “Developer Mode”.</li>
          <li>Turn Developer Mode ON.</li>
          <li>Restart the headset.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "5. INSTALL SHIZUKU v11.0 (NO PC)",
    icon: Download,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p><span className="text-red-400 font-bold">IMPORTANT:</span> You MUST install <span className="text-red-400">Shizuku v11.0</span> first. Newer versions will NOT pair correctly until v11.0 has paired once.</p>
        <p className="font-bold text-red-400">A. Download v11.0 inside the headset</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Put on the headset.</li>
          <li>Open the browser.</li>
          <li>Go to the official Shizuku GitHub releases (<a className="text-red-400 underline" href="https://github.com/RikkaApps/Shizuku/releases" target="_blank" rel="noopener noreferrer">https://github.com/RikkaApps/Shizuku/releases</a>).</li>
          <li>Scroll down to older versions.</li>
          <li>Download the Shizuku v11.0 release APK.</li>
        </ol>
        <p className="font-bold text-red-400">B. Install v11.0</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Open your file manager or APK installer.</li>
          <li>Locate the Shizuku v11.0 APK.</li>
          <li>Install it.</li>
          <li>Shizuku v11.0 will appear in your apps list.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "6. INSTALL LIGHTNING LAUNCHER (APP LAB)",
    icon: Smartphone,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Open App Lab inside the headset.</li>
          <li>Install <span className="text-red-400">Lightning Launcher</span>.</li>
          <li>Open Lightning Launcher.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "7. OPEN ANDROID SETTINGS (REAL SETTINGS)",
    icon: Settings,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Quest hides Android Settings. Lightning Launcher exposes them automatically.</p>
        <p className="font-bold text-red-400">Inside Lightning Launcher:</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Open Lightning Launcher.</li>
          <li>Scroll down the app list.</li>
          <li>Tap Android Settings.</li>
          <li>You are now inside the real Android Settings menu.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "8. UNLOCK DEVELOPER OPTIONS (BUILD NUMBER)",
    icon: MonitorCog,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p className="font-bold text-red-400">Inside Android Settings:</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Scroll down and tap System.</li>
          <li>Tap About device or About tablet.</li>
          <li>Scroll to Build number.</li>
          <li>Tap Build number 7 times.</li>
          <li>You will see: “You are now a developer.”</li>
        </ol>
        <p>Developer Options are now unlocked.</p>
      </div>
    ),
  },
  {
    title: "9. ENABLE WIRELESS DEBUGGING",
    icon: Wifi,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Inside Android Settings → System → Developer options:</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Scroll until you find Wireless debugging.</li>
          <li>Turn Wireless debugging ON.</li>
          <li>Approve any permission popups.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "10. PAIR SHIZUKU v11.0 (REQUIRED)",
    icon: ShieldCheck,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Open the Shizuku v11.0 app.</li>
          <li>Select Start via Wireless debugging.</li>
          <li>Select Pair.</li>
          <li>Go back to Android Settings → System → Developer options → Wireless debugging.</li>
          <li>Tap Pair device with pairing code.</li>
          <li>Enter the pairing code into Shizuku v11.0.</li>
        </ol>
        <p className="font-bold text-red-400 pt-2">ABOUT THE PAIRING CODE AND PORT:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>The pairing code is a temporary 6-digit code.</li>
          <li>Wireless debugging also shows a host:port (example: 192.168.x.x:xxxx).</li>
          <li>Shizuku uses BOTH: the pairing code to authenticate and the port to connect to the debugging service.</li>
        </ul>
        <ol className="list-decimal pl-5 pt-2 space-y-1 text-xs text-gray-500" start={7}>
          <li>After entering the code, return to Shizuku.</li>
          <li>Tap Start.</li>
          <li>Shizuku v11.0 should show Running.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "11. DO NOT UNINSTALL SHIZUKU",
    icon: AlertTriangle,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>If you uninstall Shizuku:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>You lose pairing.</li>
          <li>You lose permissions.</li>
          <li>You must repeat the entire setup.</li>
        </ul>
        <p>Always upgrade by installing the new APK over the old one.</p>
      </div>
    ),
  },
  {
    title: "12. UPGRADE SHIZUKU TO NEWEST VERSION (NO PC)",
    icon: Rocket,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Only do this AFTER v11.0 is paired and running.</p>
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Put on the headset.</li>
          <li>Open the browser.</li>
          <li>Go to the official Shizuku GitHub releases (<a className="text-red-400 underline" href="https://github.com/RikkaApps/Shizuku/releases" target="_blank" rel="noopener noreferrer">https://github.com/RikkaApps/Shizuku/releases</a>).</li>
          <li>Download the newest Shizuku APK.</li>
          <li>Open your file manager or installer.</li>
          <li>Install the new APK over v11.0. It will show “Upgrade” instead of “Install”.</li>
        </ol>
        <ol className="list-decimal pl-5 pt-2 space-y-1 text-xs text-gray-500" start={7}>
          <li>Open Shizuku.</li>
          <li>Tap Start again to re-activate the server.</li>
          <li>Shizuku should show Running.</li>
        </ol>
      </div>
    ),
  },
  {
    title: "13. LIGHTNING LAUNCHER DOES NOT CONNECT TO SHIZUKU",
    icon: Smartphone,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Lightning Launcher is ONLY used to open Android Settings. It does NOT connect to Shizuku and does NOT need Shizuku permissions.</p>
      </div>
    ),
  },
  {
    title: "14. TROUBLESHOOTING",
    icon: AlertTriangle,
    body: (
      <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-mono">
        <div>
          <p className="font-bold text-red-400">Shizuku stuck on “Searching”</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
            <li>Turn Wireless debugging OFF → wait → turn it ON.</li>
            <li>Reopen Shizuku and press Start.</li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-red-400">Shizuku stops running</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
            <li>Press Start again in Shizuku.</li>
          </ul>
        </div>
        <div>
          <p className="font-bold text-red-400">APK won’t install</p>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
            <li>Make sure Developer Mode is ON.</li>
            <li>Make sure your installer app has permission to install APKs.</li>
          </ul>
        </div>
      </div>
    ),
  },
];

const termuxGuideSections = [
  {
    title: "1. REQUIREMENTS",
    icon: CheckCircle2,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ul className="list-disc pl-5 space-y-1 text-xs text-gray-500">
          <li>Meta Quest headset</li>
          <li>Shizuku already installed and running</li>
          <li>Termux installed on Quest</li>
          <li>Ability to access Shizuku’s “Use Shizuku in terminal apps” menu</li>
        </ul>
      </div>
    ),
  },
  {
    title: "2. EXPORT RISH FILES FROM SHIZUKU",
    icon: Download,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-500">
          <li>Open Shizuku.</li>
          <li>Go to Use Shizuku in terminal apps.</li>
          <li>Press Export files.</li>
          <li>When asked where to export:
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-500">
              <li>Open your file manager.</li>
              <li>Go to Download.</li>
              <li>Create a folder named rish1.</li>
              <li>Select the rish1 folder.</li>
            </ul>
          </li>
          <li>Shizuku will export two files into: /sdcard/Download/rish1/
            <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-500">
              <li>rish</li>
              <li>rish_shizuku.dex</li>
            </ul>
          </li>
        </ol>
      </div>
    ),
  },
  {
    title: "3. SET UP TERMUX STORAGE",
    icon: TerminalSquare,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-500">
          <li>Open Termux.</li>
          <li>Run:</li>
        </ol>
        <CommandBlock command="termux-setup-storage" />
        <p className="text-xs text-gray-500">Press Allow when the permission popup appears.</p>
      </div>
    ),
  },
  {
    title: "4. COPY RISH FILES INTO TERMUX HOME",
    icon: Copy,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Run these commands in Termux:</p>
        <CommandBlock command={`cat /sdcard/Download/rish1/rish > ~/rish\ncat /sdcard/Download/rish1/rish_shizuku.dex > ~/rish_shizuku.dex`} />
        <p className="text-xs text-gray-500">Press Enter after each command.</p>
      </div>
    ),
  },
  {
    title: "5. SET PERMISSIONS",
    icon: ShieldCheck,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Run:</p>
        <CommandBlock command={`chmod 700 ~/rish\nchmod 400 ~/rish_shizuku.dex`} />
      </div>
    ),
  },
  {
    title: "6. SET APPLICATION ID FOR TERMUX",
    icon: Settings,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Run:</p>
        <CommandBlock command='export RISH_APPLICATION_ID="com.termux"' />
      </div>
    ),
  },
  {
    title: "7. TEST RISH",
    icon: CheckCircle2,
    body: (
      <div className="space-y-3 text-sm leading-relaxed text-gray-400 font-mono">
        <p>Run:</p>
        <CommandBlock command='~/rish -c "whoami"' />
        <p className="text-xs text-gray-500">If it prints: shell</p>
        <p className="text-xs text-gray-500">You are fully set up.</p>
      </div>
    ),
  },
  {
    title: "8. RUN ADB-STYLE COMMANDS USING RISH",
    icon: TerminalSquare,
    body: (
      <div className="space-y-4 text-sm leading-relaxed text-gray-400 font-mono">
        <div>
          <p className="font-bold text-red-400">A. Quick one-shot command</p>
          <p className="mt-2 text-xs text-gray-500">Use:</p>
          <CommandBlock command='rish -c setprop "debug.oculus.swapInterval" 2' />
        </div>
        <div>
          <p className="font-bold text-red-400">B. Full interactive ADB shell</p>
          <p className="mt-2 text-xs text-gray-500">Run:</p>
          <CommandBlock command='rish' />
          <p className="mt-3 text-xs text-gray-500">If successful, it will print your device codename:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-500">
            <li>panther on Quest 3 / 3S</li>
            <li>hollywood on Quest 2</li>
          </ul>
          <p className="mt-3 text-xs text-gray-500">Paste any ADB command directly into this shell without using rish -c.</p>
        </div>
      </div>
    ),
  },
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
              Shizuku on <span className="text-red-500">Meta Quest</span>
            </h1>
          </div>

          <p className="max-w-4xl text-sm leading-relaxed text-gray-400 font-mono">
            MUST Install Shizuku v11.0 First • Pair • THEN Upgrade
          </p>
        </div>

        <div className="mb-8 rounded border border-red-900/30 bg-black/60 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <ExternalLink className="text-red-500" size={16} />
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-white">Official source links</h2>
          </div>
          <div className="space-y-2 text-sm text-gray-400 font-mono">
            {officialSources.map((source) => (
              <p key={source.label}>
                {source.label}: <a className="text-red-400 underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.url}</a>
              </p>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <Accordion type="single" collapsible className="space-y-3">
            <AccordionItem value="meta-quest-guide" className="overflow-hidden rounded border border-red-900/25 bg-white/[0.02] backdrop-blur-sm">
              <AccordionTrigger className="px-4 py-3 text-left hover:no-underline [&>svg]:text-red-400">
                <div className="flex items-center gap-3">
                  <div className="rounded border border-red-800/35 bg-red-950/20 p-2 text-red-400">
                    <ChevronDown size={14} />
                  </div>
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-red-400 leading-relaxed">
                    Meta Quest Shizuku guide
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {questGuideSections.map(({ title, body, icon: Icon }) => (
                    <div
                      key={title}
                      className="relative rounded border border-red-900/25 bg-black/35 p-4"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600 via-red-700 to-transparent opacity-60" />
                      <div className="mb-3 flex items-start gap-3">
                        <div className="rounded border border-red-800/35 bg-red-950/20 p-2 text-red-400">
                          <Icon size={14} />
                        </div>
                        <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-red-400 leading-relaxed">
                          {title}
                        </h3>
                      </div>
                      <div className="space-y-3">{body}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="termux-guide" className="overflow-hidden rounded border border-red-900/25 bg-white/[0.02] backdrop-blur-sm">
              <AccordionTrigger className="px-4 py-3 text-left hover:no-underline [&>svg]:text-red-400">
                <div className="flex items-center gap-3">
                  <div className="rounded border border-red-800/35 bg-red-950/20 p-2 text-red-400">
                    <TerminalSquare size={14} />
                  </div>
                  <span className="font-display text-xs uppercase tracking-[0.2em] text-red-400 leading-relaxed">
                    Termux + Shizuku + Rish Setup Guide (Standalone, No-PC)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {termuxGuideSections.map(({ title, body, icon: Icon }) => (
                    <div
                      key={title}
                      className="relative rounded border border-red-900/25 bg-black/35 p-4"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-red-600 via-red-700 to-transparent opacity-60" />
                      <div className="mb-3 flex items-start gap-3">
                        <div className="rounded border border-red-800/35 bg-red-950/20 p-2 text-red-400">
                          <Icon size={14} />
                        </div>
                        <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-red-400 leading-relaxed">
                          {title}
                        </h3>
                      </div>
                      <div className="space-y-3">{body}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-8 rounded border border-red-900/30 bg-black/60 p-4 text-center text-sm text-gray-400 font-mono">
          <p>
            For more help, join the Discord <span className="text-red-400">:-)</span>
            <a
              href="https://discord.gg/r7SgjdmUF5"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-red-400 underline hover:text-red-300"
            >
              https://discord.gg/r7SgjdmUF5
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
