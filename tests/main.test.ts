import * as process from "process";
import * as cp from "child_process";
import * as path from "path";
import { test } from "vitest";

test("it should run the GitHub action", () => {
  try {
    const output = runAction({
      INPUT_CONFIG: "monokle.validation.yaml",
      INPUT_PATH: "./tests/assets/multiple-bad-resources.yaml",
      RUNNER_TEMP: "./tests/output",
    });

    console.log(output);
  } catch (err) {
    console.error(String(err.stdout));
  }
});

/**
 * Execute the JavaScript action with given environment variables.
 */
export function runAction(env: Record<string, string> = {}) {
  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value;
  });

  const np = process.execPath;
  const ip = path.join(__dirname, "..", "lib", "main.js");
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  };

  return cp.execFileSync(np, [ip], options).toString();
}
