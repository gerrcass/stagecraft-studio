import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const errors: string[] = [];

const readFrontmatter = (path: string): Record<string, string> => {
  const text = readFileSync(path, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1]!.split("\n")) {
    const pair = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (pair) result[pair[1]!] = pair[2]!.trim();
  }
  return result;
};

const skillsDir = join(root, "skills");
const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (skillDirs.length !== 7) {
  errors.push(`Expected 7 skills, found ${skillDirs.length}: ${skillDirs.join(", ")}`);
}

for (const skill of skillDirs) {
  const path = join(skillsDir, skill, "SKILL.md");
  if (!existsSync(path)) {
    errors.push(`Missing ${path}`);
    continue;
  }
  const frontmatter = readFrontmatter(path);
  if (!frontmatter.description) errors.push(`${skill}: missing description`);
  if (!frontmatter.name) errors.push(`${skill}: missing name`);
  if (frontmatter.description && frontmatter.description.length < 30) {
    errors.push(`${skill}: description is too short to trigger reliably`);
  }
}

const agentsDir = join(root, ".opencode", "agents");
const agents = readdirSync(agentsDir)
  .filter((file) => file.endsWith(".md"))
  .sort();
if (agents.length !== 4) {
  errors.push(`Expected 4 agents, found ${agents.length}: ${agents.join(", ")}`);
}
for (const agent of agents) {
  const path = join(agentsDir, agent);
  const frontmatter = readFrontmatter(path);
  if (!frontmatter.description) errors.push(`${agent}: missing description`);
  if (!frontmatter.mode) errors.push(`${agent}: missing mode`);
  if (frontmatter.model !== "opencode-go/deepseek-v4.1-flash#max") {
    errors.push(`${agent}: model must be opencode-go/deepseek-v4.1-flash#max`);
  }
}

const commandsDir = join(root, ".opencode", "commands");
const commands = readdirSync(commandsDir).filter((file) => file.endsWith(".md"));
if (commands.length < 6) {
  errors.push(`Expected at least 6 commands, found ${commands.length}`);
}

const config = JSON.parse(readFileSync(join(root, "opencode.json"), "utf8")) as {
  model?: string;
};
if (config.model !== "opencode-go/deepseek-v4.1-flash#max") {
  errors.push("opencode.json must select opencode-go/deepseek-v4.1-flash#max");
}

if (errors.length > 0) {
  console.error(errors.map((error) => `✗ ${error}`).join("\n"));
  process.exit(1);
}

console.log(`agent environment ok: ${skillDirs.length} skills, ${agents.length} agents, ${commands.length} commands`);
