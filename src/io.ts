import {
  getFileLocation,
  getRuleForResultV2,
  ValidationResponse,
  ValidationResult,
  ValidationRun,
} from "@monokle/validation";
import * as core from "@actions/core";
import styles from "ansi-styles";

export function printResponse(response: ValidationResponse) {
  for (const run of response.runs) {
    const groupedResults = groupResultsByExtension(run);

    for (const [groupName, groupResults] of groupedResults) {
      if (groupResults.length === 0) {
        core.startGroup(
          `${styles.color.green.open}Run ${groupName}${styles.color.green.close}`
        );
        core.info("No problems detected");
        core.endGroup();
        continue;
      }

      core.startGroup(
        `${styles.color.red.open}Run ${groupName} (${groupResults.length} problems)${styles.color.red.close}`
      );

      for (const result of groupResults) {
        const rule = getRuleForResultV2(run, result);
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
}

function groupResultsByExtension(responseRun: ValidationRun) {
  const groups: Map<string, ValidationResult[]> = new Map(); // <extensionName, results>
  const extensions = responseRun.tool.extensions ?? [];

  for (const extension of extensions) {
    groups.set(extension.name, []);
  }

  for (const result of responseRun.results) {
    const extensionName = result.rule.toolComponent.name;

    groups.get(extensionName)!.push(result);
  }

  return groups;
}
