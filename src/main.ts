import * as core from "@actions/core";
import * as fs from "fs/promises";
import * as fse from "fs-extra";
import * as path from "path";
import { configureValidator, createValidator } from "./validator.js";

import "isomorphic-fetch";
import { extractK8sResources, File } from "./parse.js";
import { printResponse } from "./io.js";
import { Resource, ValidationResponse } from "@monokle/validation";

async function run(): Promise<void> {
  try {
    const validator = createValidator();
    await configureValidator(validator);

    const resources = await getResources();

    if (resources.length === 0) {
      core.warning("No resources found");
      return;
    }

    const response = await validator.validate(resources);

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

async function getResources(): Promise<Resource[]> {
  const bundle = await getBundle();
  return extractK8sResources([bundle]);
}

async function getBundle(): Promise<File> {
  const inputPath = core.getInput("path");
  const data = await fs.readFile(inputPath);
  const content = data.toString();

  return {
    id: "bundle",
    content,
    path: inputPath,
  };
}

async function outputSarifResponse(
  response: ValidationResponse
): Promise<void> {
  const outputPath = `monokle-${Date.now()}.sarif`;
  await fse.outputFile(outputPath, JSON.stringify(response));
  core.setOutput("sarif", outputPath);
}

run();
