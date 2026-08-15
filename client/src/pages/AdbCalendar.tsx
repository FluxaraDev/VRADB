import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, CalendarDays, Lock, Unlock, ShieldCheck, Sparkles } from "lucide-react";
import ShootingStars from "@/components/ShootingStars";
import { getDateSeededArchiveEntry } from "@/lib/adbArchive";

const TEMP_CODE = 81526;
const TEMP_LOCK_ENABLED: boolean = true;

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isDateUnlocked(date: Date) {
  if (!TEMP_LOCK_ENABLED) return true;

  const today = new Date();
  const canonicalToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const canonicalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return canonicalDate <= canonicalToday;
}

function isCodeUnlocked() {
  return !TEMP_LOCK_ENABLED;
}

export default function AdbCalendarPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const calendarDays = useMemo(() => {
    const firstDay = new Date(selectedYear, selectedMonth, 1);
    const monthLength = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const startOffset = (firstDay.getDay() + 6) % 7;
    const cells: Array<{ date: Date; isCurrentMonth: boolean }> = [];

    for (let i = 0; i < startOffset; i += 1) {
      const date = new Date(selectedYear, selectedMonth, i - startOffset + 1);
      cells.push({ date, isCurrentMonth: false });
    }

    for (let day = 1; day <= monthLength; day += 1) {
      cells.push({ date: new Date(selectedYear, selectedMonth, day), isCurrentMonth: true });
    }

    while (cells.length % 7 !== 0) {
      const nextDay = cells.length - (monthLength + startOffset) + 1;
      cells.push({ date: new Date(selectedYear, selectedMonth + 1, nextDay), isCurrentMonth: false });
    }

    return cells;
  }, [selectedMonth, selectedYear]);

  const monthLabel = new Date(selectedYear, selectedMonth).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const previousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((y) => y - 1);
      return;
    }

    setSelectedMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((y) => y + 1);
      return;
    }

    setSelectedMonth((m) => m + 1);
  };

  const userHasUnlocked = isCodeUnlocked();

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
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-2 rounded border border-red-900/30 px-2.5 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-red-400 transition-colors hover:border-red-600/50 hover:text-red-300">
              <ArrowLeft size={12} />
              HOME
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded border border-red-700/50 bg-red-950/30 text-red-500">
                <CalendarDays size={18} />
              </div>
              <div>
                <div className="font-display text-sm font-black tracking-widest text-white leading-none">
                  ADB<span className="text-red-500">CALENDAR</span>
                </div>
                <div className="mt-0.5 text-[9px] font-mono uppercase tracking-[0.2em] text-gray-700 leading-none">
                  DATE LOCKED GUIDE
                </div>
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 text-[10px] font-mono text-gray-700 sm:flex">
            <ShieldCheck size={10} className="text-red-700" />
            <span>
              <span className="text-red-600 font-bold">TEMP</span> {TEMP_LOCK_ENABLED ? `CODE ${TEMP_CODE}` : "DISABLED"}
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-6 rounded border border-red-900/25 bg-black/70 p-4 md:p-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-500">
                <Sparkles size={10} />
                DAILY ADB MAP
              </div>
              <h1 className="font-display text-2xl md:text-4xl font-black tracking-tight text-white">
                CHEAT <span className="text-red-500">CALENDAR</span>
              </h1>
            </div>

            <div className="inline-flex items-center gap-2 rounded border border-red-900/30 bg-red-950/15 px-3 py-2 text-[10px] font-mono uppercase tracking-[0.2em] text-red-300">
              {userHasUnlocked ? <Unlock size={12} /> : <Lock size={12} />}
              {userHasUnlocked ? "UNLOCKED" : "TEMPORARILY LOCKED"}
            </div>
          </div>

          <div className="rounded border border-red-900/20 bg-black/60 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button type="button" onClick={previousMonth} className="rounded border border-red-900/30 bg-red-950/20 px-2 py-1 text-xs text-red-300 hover:border-red-700/50">←</button>
              <div className="font-display text-lg text-white">{monthLabel}</div>
              <button type="button" onClick={nextMonth} className="rounded border border-red-900/30 bg-red-950/20 px-2 py-1 text-xs text-red-300 hover:border-red-700/50">→</button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-mono uppercase tracking-[0.2em] text-gray-600">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="py-1">{day}</div>
              ))}
            </div>

            <div className="mt-2 grid grid-cols-7 gap-2">
              {calendarDays.map(({ date, isCurrentMonth }) => {
                const isLocked = !isDateUnlocked(date);
                const isToday = formatDateKey(date) === formatDateKey(new Date());
                const entry = getDateSeededArchiveEntry(date);

                const cellStyle = isCurrentMonth
                  ? "border-red-900/25 bg-black/55 text-gray-100"
                  : "border-red-950/10 bg-black/20 text-gray-700 opacity-60";

                return (
                  <div
                    key={date.toISOString()}
                    className={`min-h-[100px] rounded border p-2 ${cellStyle} ${isToday ? "shadow-[0_0_18px_rgba(220,38,38,0.12)]" : ""}`}
                  >
                    <div className="mb-2 flex items-center justify-between text-[10px] font-mono">
                      <span className={isToday ? "text-red-400" : "text-gray-400"}>{date.getDate()}</span>
                      {isLocked ? <Lock size={10} className="text-red-500" /> : <Unlock size={10} className="text-green-500" />}
                    </div>

                    {isCurrentMonth && entry && !isLocked ? (
                      <div className="mt-1 flex min-h-[44px] flex-col justify-between rounded border border-red-900/15 bg-red-950/10 p-1.5 text-[9px] leading-relaxed text-gray-200">
                        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-red-300">ADB</span>
                        <span className="line-clamp-3 text-[9px] text-green-400">{entry.text}</span>
                      </div>
                    ) : isCurrentMonth ? (
                      <div className="mt-1 flex min-h-[44px] items-center justify-center rounded border border-red-900/15 bg-black/30 p-1 text-[9px] uppercase tracking-[0.12em] text-red-500">
                        {isLocked ? "Locked" : "No data"}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
