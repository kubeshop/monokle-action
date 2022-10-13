import * as core from "@actions/core";
import * as fse from "fs-extra";

import {
  createDefaultMonokleValidator,
  readConfig,
  ValidationResponse,
} from "@monokle/validation";
import { printResponse } from "./io.js";
import { extractK8sResources } from "./parse.js";

import "isomorphic-fetch";
import { readFiles } from "./readFiles.js";

async function run(): Promise<void> {
  try {
    const validator = createDefaultMonokleValidator();
    const configPath = core.getInput("config") ?? "monokle.validation.yaml";
    const config = await readConfig(configPath);
    await validator.preload({ file: config });

    const inputPath = core.getInput("path");
    const files = await readFiles(inputPath);
    const resources = extractK8sResources(files);

    if (resources.length === 0) {
      core.warning("No resources found");
      return;
    }

    const response = await validator.validate({ resources });

    const errorCount = response.runs.reduce(
      (sum, r) => sum + r.results.length,
      0
    );

    printResponse(response);

    await outputSarifResponse(response);

    if (errorCount > 0) {
      core.setFailed(`${errorCount} problems detected`);
    } else {
      core.notice("No problems detected");
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(`[unexpected] ${error.message}`);
  }
}

async function outputSarifResponse(
  response: ValidationResponse
): Promise<void> {
  const outputPath = `monokle-${Date.now()}.sarif`;
  await fse.outputFile(outputPath, JSON.stringify(response));
  core.setOutput("sarif", outputPath);
}

run();
