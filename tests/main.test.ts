import * as process from "process";
import * as cp from "child_process";
import * as path from "path";
import { test } from "vitest";

test("it should run the GitHub action", () => {
  const output = runAction({
    INPUT_MILLISECONDS: "500",
  });

  console.log(output);
});

/**
 * Execute the JavaScript action with given environment variables.
 */
export function runAction(env: Record<string, string>) {
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
