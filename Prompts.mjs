import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile } from "node:fs/promises";

// Prompting Files and Folders options

const rl = readline.createInterface({ input, output });

let sourceFolder = await rl.question(
  "\nFolder name where JSON file is located? > "
);
if (sourceFolder == "") {
  sourceFolder = "./JSON-DevKit";
  console.warn(`Empty, using:\t ${sourceFolder}`);
} else {
  console.warn(`${sourceFolder}`);
}

let sourceTable = await rl.question(
  "\nOriginal JSON file name (exclude '.json')? > "
);
if (sourceTable == "") {
  sourceTable = "ItemTable";
  console.warn(`Empty, using:\t ${sourceTable}`);
} else {
  console.warn(`${sourceTable}`);
}

let appendName = await rl.question(
  "\nString to append at the end of resulting file name? > "
);
if (appendName == "") {
  appendName = "-parsed";
  console.warn(`Empty, using:\t ${appendName}`);
} else {
  console.warn(`${appendName}`);
}

let destFolder = await rl.question(
  "\nFolder name where to save the resulting file (must exist)? > "
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

// Declare functions

async function readJsonFile() {
  console.warn("\nReading source JSON file...");
  let jsonDataTable = {};

  // Loading source JSON file into memory
  try {
    jsonDataTable = await JSON.parse(
      await readFile(new URL(`${sourceFile}`, import.meta.url))
    );

    console.log("Done.");

    return jsonDataTable;
  } catch (err) {
    console.error(err.message, "\n");
    process.exit(1);
  }
}

async function fillRowNames(dataTableItem) {
  // Only use first item of json data, every other object muste be equal so it's unnecesary to check the rest
  console.warn("\nFilling row names...");

  const rowNames = [];

  for (let i = 0; i < Object.keys(dataTableItem).length; i++) {
    const objKey = Object.keys(dataTableItem)[i];
    const objVal = dataTableItem[objKey];

    if (
      typeof objVal === "string" &&
      objVal.includes("NSLOCTEXT") &&
      !rowNames.includes(objKey)
    ) {
      rowNames.push(objKey);
    }
  }

  console.log("Done.");

  return rowNames;
}

async function removeNSLOCTEXT(dataTable, rowsArray) {
  console.warn("\nClearing NSLOCTEXT text...");

  const newJsonData = [];

  dataTable.forEach((element) => {
    for (let i = 0; i < rowsArray.length; i++) {
      let newName = element[rowsArray[i]];

      newName = newName
        // Trim last chars (a double quote and a parenthesis)
        .slice(0, newName.length - 2)
        // Remove NSLOCTEXT... text data
        .replace(
          `NSLOCTEXT("", "${sourceTable}_${element.RowName}_${rowsArray[i]}", "`,
          ""
        );

      // Overwrite old text data with parsed one
      element[rowsArray[i]] = newName;

      // Replace "Name" property to "ItemName" to avoid SQL cloumn name problems
      if (rowsArray[i] == "Name") {
        element = {
          // Set this property as first one, cloning object
          ItemName: element[rowsArray[i]],
          ...element,
        };
        // Remove old "Name" property
        delete element["Name"];
      }
    }

    newJsonData.push(element);
  });

  console.log("Done.");

  return newJsonData;
}

async function bindItemNameToDataTable() {}

// Select option

/**
 * 1) Only remove NSLOCTEXT()
 * 2) Only bind itemID to itemName
 * 3) Both
 */
console.warn("\nChoose an option:");
let option = await rl.question(
  "\n1) Only remove NSLOCTEXT()\n2) Only bind itemID to itemName\n3) Both\n\n? > "
);
console.log("");
if (["1", "2", "3"].includes(option)) {
  console.warn(`${option}`);
  switch (option) {
    case "1":
      const dataTable = await readJsonFile();
      const rowsToAffect = await fillRowNames(dataTable[0]);
      const clearJson = await removeNSLOCTEXT(dataTable, rowsToAffect);
      console.log(clearJson[0].ShortDesc);
      break;
    case "2":
      break;
    case "3":
      break;
  }
} else {
  console.error(`Invalid option: ${option}`);
  process.exit(1);
}

rl.close();

