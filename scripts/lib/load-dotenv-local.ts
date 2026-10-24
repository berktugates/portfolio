import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Repo kökünden `.env.local` ve `.env` yükler (mevcut process env’i ezmez). */
export function loadDotenvLocal(root: string): void {
  for (const name of [".env.local", ".env"]) {
    try {
      const raw = readFileSync(resolve(root, name), "utf8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eq = trimmed.indexOf("=");
        if (eq === -1) continue;
        const key = trimmed.slice(0, eq).trim();
        let value = trimmed.slice(eq + 1).trim();
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }
        if (!(key in process.env)) process.env[key] = value;
      }
    } catch {
      // optional
    }
  }
}
