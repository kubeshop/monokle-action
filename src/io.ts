import { ValidationResponse } from "@monokle/validation";
import * as core from "@actions/core";

export function printResponse(response: ValidationResponse) {
  for (const run of response.runs) {
    if (run.results.length === 0) continue;

    core.startGroup(run.tool.driver.name);

    for (const result of run.results) {
      core.info(`[${result.ruleId}] ${result.message.text}`);
    }

    core.endGroup();
  }
}
