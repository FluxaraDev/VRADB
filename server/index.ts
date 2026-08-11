import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARCHIVE_URLS = [
  {
    label: "hellaadbs.txt",
    url: "https://marbleshub.neocities.org/ASSETS/hellaadbs.txt",
  },
  {
    label: "Adbs.txt",
    url: "https://marbleshub.neocities.org/ASSETS/Adbs%20.txt",
  },
] as const;

function parseArchiveText(raw: string, sourceLabel: string) {
  const seen = new Set<string>();

  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const normalized = line.toLowerCase();
      return (
        normalized.includes("adb") ||
        normalized.includes("setprop") ||
        normalized.includes("settings") ||
        normalized.includes("debug") ||
        normalized.includes("dumpsys") ||
        normalized.includes("cmd ") ||
        normalized.includes("pm ") ||
        normalized.includes("am ")
      );
    })
    .map((line, index) => {
      const cleaned = line
        .replace(/^[-*•]\s*/, "")
        .replace(/^\d+[.)-]\s*/, "")
        .trim();

      if (!cleaned) return null;

      const id = `${sourceLabel}-${index}-${cleaned.slice(0, 80)}`;
      if (seen.has(id)) return null;
      seen.add(id);

      return {
        id,
        source: sourceLabel,
        text: cleaned,
      };
    })
    .filter(Boolean);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.get("/api/archive", async (_req, res) => {
    try {
      const pages = await Promise.all(
        ARCHIVE_URLS.map(async ({ label, url }) => {
          const response = await fetch(url, { headers: { Accept: "text/plain" } });
          if (!response.ok) {
            throw new Error(`Failed to fetch ${label}: ${response.status}`);
          }
          const raw = await response.text();
          return parseArchiveText(raw, label);
        })
      );

      const entries = pages.flat();
      res.json({ entries });
    } catch (error) {
      console.error("Archive fetch failed:", error);
      res.status(502).json({
        error: "Unable to load the remote archive files.",
      });
    }
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
