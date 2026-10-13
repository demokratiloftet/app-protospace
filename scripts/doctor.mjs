import { spawnSync } from "node:child_process";
const major = Number(process.versions.node.split(".")[0]);
let failed = major !== 24;
console.log(
  `${failed ? "FAIL" : "OK"} Node ${process.versions.node} (use .node-version)`,
);
for (const [command, args, required] of [
  ["git", ["--version"], true],
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
  "Local development: npm ci && npm run dev. Docker is optional; Tailscale is needed for the shared private demo.",
);
process.exitCode = failed ? 1 : 0;
