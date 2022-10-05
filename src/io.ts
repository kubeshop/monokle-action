import {
  getFileLocation,
  getRuleForResult,
  ValidationResponse,
} from "@monokle/validation";
import * as core from "@actions/core";
import styles from "ansi-styles";

export function printResponse(response: ValidationResponse) {
  for (const run of response.runs) {
    core.info(`${styles.color.blue}Run ${run.tool.driver.name}`);

    if (run.results.length === 0) {
      core.info("No problems detected");
      core.info("");
      continue;
    }

    for (const result of run.results) {
      const rule = getRuleForResult(response, result);

      core.startGroup(run.tool.driver.name);
      core.error(`[${result.ruleId}] ${result.message.text}`);
      core.error(
        `  found at ${result.locations[0].physicalLocation?.artifactLocation.uri}`
      );
      core.error(`    ${rule.fullDescription} ${rule.help}`);
      core.endGroup();
    }

    core.info("");
  }
}
