import { lstatSync } from "fs";
import { readFile as readFileFromFs } from "fs/promises";
import chunkArray from "lodash/chunk.js";
import glob from "tiny-glob";
import { File } from "./parse";

export async function readFiles(path: string): Promise<File[]> {
  if (isFileLike(path)) {
    const file = await readFile(path);
    return [file];
  } else {
    return readDirectory(path);
  }
}

function isFileLike(path: string) {
  return lstatSync(path).isFile();
}

async function readFile(path: string): Promise<File> {
  const content = await readFileFromFs(path, "utf8");

  return {
    id: path,
    path,
    content,
  };
}

async function readDirectory(directoryPath: string): Promise<File[]> {
  const filePaths = await glob(`${directoryPath}/**/*.{yaml,yml}`);
  const files: File[] = [];

  for (const chunk of chunkArray(filePaths, 5)) {
    const promise = await Promise.allSettled(
      chunk.map(async (path) => {
        const content = await readFileFromFs(path, "utf8");
        return { id: path, path, content };
      })
    );

    for (const result of promise) {
      if (result.status === "rejected") {
        continue;
      }
      files.push(result.value);
    }
  }

  return files;
}
