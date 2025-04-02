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

let sourceFile = `${sourceFolder}/${sourceTable}.json`;
let destFile = `${destFolder}/${sourceTable}${appendName}.json`;

console.log("");
console.table({
  Source: sourceFile,
  Dest: destFile,
});

/**
 * 1) Only remove NSLOCTEXT()
 * 2) Only bind itemID to itemName
 * 3) Both
 */
let option = await rl.question(
  "\nChoose an option:\n\n1) Only remove NSLOCTEXT()\n2) Only bind itemID to itemName\n3) Both\n\n? "
);
if (["1", "2", "3"].includes(option)) {
  console.warn(`${option}`);
} else {
  console.error(`Invalid option: ${option}`);
  process.exit(1);
}

rl.close();

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

// Declare functions

async function removeNSLOCTEXT() {}

async function bindItemNameToDataTable() {}

