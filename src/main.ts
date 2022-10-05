import * as core from "@actions/core";
import * as fs from "fs";
import { configureValidator, createValidator } from "./validator.js";

import "isomorphic-fetch";
import { extractK8sResources, File } from "./parse.js";
import { printResponse } from "./io.js";

async function run(): Promise<void> {
  try {
    const validator = createValidator();
    await configureValidator(validator);

    const resources = getResources();

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

    if (errorCount > 0) {
      core.setFailed(`${errorCount} problems detected`);
    } else {
      core.notice("No problems detected");
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(`[unexpected] ${error.message}`);
  }
}

function getResources() {
  const bundle = getBundle();
  return extractK8sResources([bundle]);
}

function getBundle(): File {
  const path = core.getInput("path");
  const content = fs.readFileSync(path).toString();

  return {
    id: "bundle",
    content,
    path,
  };
}

run();
