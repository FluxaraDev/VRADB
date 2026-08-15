import { useMemo, useState } from "react";
import { CalendarClock, Copy, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { getDailyArchiveEntry } from "@/lib/adbArchive";

export default function DailyAdbBanner() {
  const [closed, setClosed] = useState(false);

  const entry = useMemo(() => getDailyArchiveEntry(), []);

  if (!entry || closed) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(entry.text);
      toast.success("ADB OF THE DAY COPIED", {
        description: `> ${entry.text}`,
        duration: 1800,
        style: {
          background: "#000902",
          border: "1px solid #DC2626",
          color: "#f1f5f9",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
        },
      });
    } catch {
      toast.error("COPY FAILED — SELECT AND COPY MANUALLY");
    }
  };

  return (
    <div className="relative z-50 border-b border-red-900/30 bg-black/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded border border-red-700/40 bg-red-950/30 text-red-400">
            <CalendarClock size={14} />
          </div>

          <div className="min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-red-400">
              <Sparkles size={10} className="shrink-0" />
              <span>ADB OF THE DAY</span>
            </div>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-gray-200">
              <span className="truncate font-mono text-green-400">{entry.text}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-gray-600">{entry.source}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded border border-red-800/40 bg-red-950/20 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-red-300 transition-colors hover:border-red-600/60 hover:text-red-100"
          >
            <Copy size={10} />
            Copy
          </button>

          <button
            type="button"
            aria-label="Close ADB of the day banner"
            onClick={() => setClosed(true)}
            className="inline-flex h-7 w-7 items-center justify-center rounded border border-red-900/30 bg-black/40 text-gray-400 transition-colors hover:border-red-700/50 hover:text-red-300"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
