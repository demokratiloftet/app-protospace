import { spawnSync } from "node:child_process";
const [major, minor] = process.versions.node.split(".").map(Number);
let failed = major !== 24 || minor < 17;
console.log(
  `${failed ? "FAIL" : "OK"} Node ${process.versions.node} (use .node-version)`,
);
for (const [command, args, required] of [
  ["git", ["--version"], true],
  ["pnpm", ["--version"], true],
  ["docker", ["compose", "version"], false],
  ["gh", ["--version"], false],
  ["tailscale", ["version"], false],
]) {
  const r = spawnSync(command, args, { encoding: "utf8" });
  console.log(
    `${r.status === 0 ? "OK" : required ? "FAIL" : "OPTIONAL"} ${command}`,
  );
  if (required && r.status !== 0) failed = true;
}
console.log(
  "Local development: pnpm install --frozen-lockfile && pnpm dev. Docker is optional; Tailscale is needed for the shared private demo.",
);
process.exitCode = failed ? 1 : 0;
