import fs from "node:fs";
import path from "node:path";

export function getReflectorGuideMarkdown(): string {
  const filePath = path.join(process.cwd(), "content", "reflector.md");
  return fs.readFileSync(filePath, "utf8");
}
