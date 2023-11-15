import * as core from "@actions/core";
import * as fse from "fs-extra";

import {
  createDefaultMonokleValidator,
  readConfig,
  ValidationResponse,
} from "@monokle/validation";
import { extractK8sResources } from "@monokle/parser";
import { printResponse } from "./io.js";

import "isomorphic-fetch";
import { readFiles } from "./readFiles.js";

async function run(): Promise<void> {
  try {
    const validator = createDefaultMonokleValidator();
    const configPath = core.getInput("config") ?? "monokle.validation.yaml";
    const config = await readConfig(configPath);
    await validator.preload(config);

    const inputPath = core.getInput("path");
    const files = await readFiles(inputPath);
    const resources = extractK8sResources(files);

    if (resources.length === 0) {
      core.warning("No resources found");
      return;
    }

    const response = await validator.validate({ resources });

    const { problemCount, warningCount, errorCount } = countProblems(response);

    if (errorCount > 0) {
      core.setFailed(
        `${problemCount} problems detected (${errorCount} errors)`
      );
    } else {
      if (problemCount > 0) {
        core.warning(`${warningCount} warnings detected`);
      } else {
        core.notice("No problems detected");
      }
    }

    printResponse(response);

    await outputSarifResponse(response);
  } catch (error) {
    if (error instanceof Error) core.setFailed(`[unexpected] ${error.message}`);
  }
}

export function countProblems(response: ValidationResponse) {
  const warningCount = response.runs.reduce(
    (sum, run) =>
      sum + run.results.reduce((s, r) => s + (r.level === "error" ? 0 : 1), 0),
    0
  );
  const errorCount = response.runs.reduce(
    (sum, run) =>
      sum + run.results.reduce((s, r) => s + (r.level === "error" ? 1 : 0), 0),
    0
  );
  const problemCount = warningCount + errorCount;

  return { problemCount, errorCount, warningCount };
}

async function outputSarifResponse(
  response: ValidationResponse
): Promise<void> {
  const outputPath = `monokle-${Date.now()}.sarif`;
  await fse.outputFile(outputPath, JSON.stringify(response));
  core.setOutput("sarif", outputPath);
}

run();
