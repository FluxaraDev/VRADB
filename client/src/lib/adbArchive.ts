import list1Text from "@/data/list1.txt?raw";

export type ArchiveEntry = {
  id: string;
  source: string;
  text: string;
};

const ARCHIVE_SOURCES = [
  { label: "list1.txt", raw: list1Text },
] as const;

export const extractQuotedSegments = (text: string): string[] => {
  const quoted = text.match(/"([^"]+)"/g) ?? [];
  return quoted
    .map((segment) => segment.replace(/^"|"$/g, "").trim())
    .filter(Boolean);
};

export const splitCandidateParts = (text: string): string[] => {
  return text
    .split(/(?:&&|;)/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.replace(/^['"`]+|['"`,]+$/g, "").trim())
    .filter(Boolean);
};

export const normalizeCommand = (raw: string): string | null => {
  const cleaned = raw
    .replace(/^[-*•]\s*/, "")
    .replace(/^\d+[.)-]\s*/, "")
    .replace(/^"|"$/g, "")
    .replace(/^[\s'"`]+|[\s'"`,]+$/g, "")
    .replace(/\r/g, "")
    .trim();

  if (!cleaned) return null;

  const normalizedText = cleaned.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();
  const lower = normalizedText.toLowerCase();

  if (lower.includes("adb shell")) {
    const withoutPrefix = normalizedText.replace(/^adb\s+shell\s+/i, "").trim();
    if (!withoutPrefix) return null;
    return `adb shell ${withoutPrefix}`.replace(/\s+/g, " ").trim();
  }

  if (normalizedText.startsWith("setprop ")) {
    return `adb shell ${normalizedText}`.replace(/\s+/g, " ").trim();
  }

  const propertyMatch = normalizedText.match(/(?:debug|persist\.debug)\.oculus\.[A-Za-z0-9_.-]+/i);
  if (propertyMatch) {
    const prop = propertyMatch[0];
    const rest = normalizedText.slice(normalizedText.indexOf(prop) + prop.length).trim();
    const value = rest && !/^[:=,;]+$/.test(rest) ? rest : "1";
    return `adb shell setprop ${prop} ${value}`.replace(/\s+/g, " ").trim();
  }

  return null;
};

export function parseArchiveText(raw: string, sourceLabel: string): ArchiveEntry[] {
  const entries: ArchiveEntry[] = [];

  raw.split(/\r?\n/).forEach((line, lineIndex) => {
    const base = line.trim();
    if (!base) return;

    const candidates = [base, ...extractQuotedSegments(base)];

    candidates.forEach((candidate) => {
      splitCandidateParts(candidate).forEach((part) => {
        const normalized = normalizeCommand(part);
        if (!normalized) return;

        entries.push({
          id: `${sourceLabel}-${lineIndex}-${normalized.slice(0, 80)}`,
          source: sourceLabel,
          text: normalized,
        });
      });
    });
  });

  return entries;
}

export function getArchiveEntries(): ArchiveEntry[] {
  return ARCHIVE_SOURCES.flatMap(({ label, raw }) => parseArchiveText(raw, label));
}

const DAILY_FAMILIES = new Set(["debug", "persist", "ro", "sys", "vendor", "service", "vr"]);

export function isDailyPickable(entry: ArchiveEntry): boolean {
  const match = entry.text.match(/^adb shell setprop (\S+)/);
  if (!match) return false;
  const prop = match[1];
  if (prop.endsWith(".")) return false;
  const segments = prop.split(".");
  if (!DAILY_FAMILIES.has(segments[0])) return false;
  // Reject decompiled class-name debris (e.g. oculus.navigator...AppRoot.onCreate)
  return segments.every((seg) => !/^[A-Z]/.test(seg));
}

export function getDateSeededArchiveEntry(date: Date): ArchiveEntry | null {
  const all = getArchiveEntries();
  if (!all.length) return null;
  const pickable = all.filter(isDailyPickable);
  const entries = pickable.length ? pickable : all;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const dateKey = Number(`${year}${String(month).padStart(2, "0")}${String(day).padStart(2, "0")}`);
  const index = Math.abs(Math.floor((dateKey * 17 + day * 13 + month * 7) % entries.length));

  return entries[index] ?? entries[0];
}

export function getDailyArchiveEntry(date = new Date()): ArchiveEntry | null {
  return getDateSeededArchiveEntry(date);
}
