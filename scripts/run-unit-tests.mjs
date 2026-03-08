import { spawnSync } from "node:child_process";
import { readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDir, "..");
const testDistDir = path.join(projectRoot, ".test-dist");
const tscEntrypoint = path.join(projectRoot, "node_modules", "typescript", "bin", "tsc");

function walkTests(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      files.push(...walkTests(fullPath));
      continue;
    }

    if (entry.endsWith(".test.js")) {
      files.push(fullPath);
    }
  }

  return files;
}

rmSync(testDistDir, { recursive: true, force: true });

const compileResult = spawnSync(process.execPath, [tscEntrypoint, "-p", "tsconfig.test.json"], {
  cwd: projectRoot,
  stdio: "inherit",
});

if (compileResult.status !== 0) {
  process.exit(compileResult.status ?? 1);
}

const compiledTests = walkTests(path.join(testDistDir, "tests"));

if (compiledTests.length === 0) {
  console.error("No compiled unit tests were found.");
  process.exit(1);
}

const testResult = spawnSync(process.execPath, ["--test", ...compiledTests], {
  cwd: projectRoot,
  stdio: "inherit",
});

process.exit(testResult.status ?? 1);
