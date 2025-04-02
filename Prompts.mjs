import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile } from "node:fs/promises";

// Prompting Files and Folders options

const rl = readline.createInterface({ input, output });

let sourceFolder = await rl.question(
  "\nFolder name where JSON file is located? "
);
if (sourceFolder == "") {
  sourceFolder = "./JSON-DevKit";
  console.warn(`Empty, using:\t ${sourceFolder}`);
} else {
  console.warn(`${sourceFolder}`);
}

let sourceTable = await rl.question(
  "\nOriginal JSON file name (exclude '.json')? "
);
if (sourceTable == "") {
  sourceTable = "RecipesTable";
  console.warn(`Empty, using:\t ${sourceTable}`);
} else {
  console.warn(`${sourceTable}`);
}

let appendName = await rl.question(
  "\nString to append at the end of resulting file name? "
);
if (appendName == "") {
  appendName = "-parsed";
  console.warn(`Empty, using:\t ${appendName}`);
} else {
  console.warn(`${appendName}`);
}

let destFolder = await rl.question(
  "\nFolder name where to save the resulting file (must exist)? "
);
if (destFolder == "") {
  destFolder = "JSON-Parsed";
  console.warn(`Empty, using:\t ${destFolder}`);
} else {
  console.warn(`${destFolder}`);
}

rl.close();

let sourceFile = `${sourceFolder}/${sourceTable}.json`;
let destFile = `${destFolder}/${sourceTable}${appendName}.json`;

console.log(`\n>> Source:\t ${sourceFile}`);
console.log(`>> Dest:\t ${destFile}\n`);

// Loading source JSON file into memory

let jsonDataTable = {};

try {
  jsonDataTable = await JSON.parse(
    await readFile(new URL(`${sourceFile}`, import.meta.url))
  );
} catch (err) {
  console.error(err.message, "\n");
  process.exit(1);
}

// Print just first result to test
console.log(jsonDataTable[0].ShortDesc);

