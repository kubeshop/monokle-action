import {
  getFileLocation,
  getRuleForResult,
  ValidationResponse,
} from "@monokle/validation";
import * as core from "@actions/core";
import styles from "ansi-styles";

export function printResponse(response: ValidationResponse) {
  for (const run of response.runs) {
    if (run.results.length === 0) {
      core.startGroup(
        `${styles.color.blue.open}Run ${run.tool.driver.name}${styles.color.blue.close}`
      );
      core.info("No problems detected");
      core.endGroup();
      core.info("");
      continue;
    }

    core.startGroup(
      `${styles.color.red.open}Run ${run.tool.driver.name}${styles.color.red.close} (${run.results.length} problems)`
    );

    for (const result of run.results) {
      const rule = getRuleForResult(response, result);
      const location = getFileLocation(result);

      core.error(`[${result.ruleId}] ${result.message.text}`);
      core.error(
        `  found at ${location.physicalLocation?.artifactLocation.uri}:${location.physicalLocation?.region?.startColumn}`
      );
      core.error(`    ${rule.fullDescription.text} ${rule.help.text}`);
      core.endGroup();
    }

    core.info("");
  }
}
