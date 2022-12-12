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
        `${styles.color.green.open}Run ${run.tool.driver.name}${styles.color.green.close}`
      );
      core.info("No problems detected");
      core.endGroup();
      continue;
    }

    core.startGroup(
      `${styles.color.red.open}Run ${run.tool.driver.name} (${run.results.length} problems)${styles.color.red.close}`
    );

    for (const result of run.results) {
      const rule = getRuleForResult(response, result);
      const location = getFileLocation(result);

      const L1 = `[${result.ruleId}] ${result.message.text}`;
      const L2 = `\n  found at ${location.physicalLocation?.artifactLocation.uri}:${location.physicalLocation?.region?.startColumn}`;
      const L3 = `\n    ${rule.fullDescription?.text ?? rule.shortDescription.text}`;
      const L4 = `\n      ${rule.help.text}`;

      if (result.level === "error") {
        core.error(`${L1}${L2}${L3}${L4}`);
      } else {
        core.warning(`${L1}${L2}${L3}${L4}`);
      }
    }

    core.endGroup();
  }
}
