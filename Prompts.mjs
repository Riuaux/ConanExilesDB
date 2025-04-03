import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { readFile, writeFile } from "node:fs/promises";

// Prompting Files and Folders options

const rl = readline.createInterface({ input, output });

let sourceFolder = await rl.question(
  "\nFolder name where JSON files from DevKit are located? > "
);
if (sourceFolder == "") {
  sourceFolder = "JSON-DevKit";
  console.warn(`Empty, using:\t ${sourceFolder}`);
} else {
  console.warn(`${sourceFolder}`);
}

let sourceTable = await rl.question(
  "\nOriginal JSON file name (exclude '.json')? > "
);
if (sourceTable == "") {
  sourceTable = "RecipesTable";
  console.warn(`Empty, using:\t ${sourceTable}`);
} else {
  console.warn(`${sourceTable}`);
}

// let appendName = await rl.question(
//   "\nString to append at the end of resulting file name? > "
// );
// if (appendName == "") {
//   appendName = "parsed";
//   console.warn(`Empty, using:\t ${appendName}`);
// } else {
//   console.warn(`${appendName}`);
// }

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
let destFile = `${destFolder}/${sourceTable}_(operationName).json`;
let templateFile = `${sourceFolder}/ItemNameToTemplateID.json`;

console.log("");
console.table({
  Source: sourceFile,
  Dest: destFile,
  Template: templateFile,
});

// Declare functions

async function readJsonFile(srcFolder, srcTable) {
  console.warn("\nReading source JSON file...");
  let jsonDataTable = {};

  const srcFile = `${srcFolder}/${srcTable}.json`;

  // Loading source JSON file into memory
  try {
    jsonDataTable = await JSON.parse(
      await readFile(new URL(`${srcFile}`, import.meta.url))
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

async function bindItemNameToDataTable(dataTable) {
  console.warn("\nBinding itemNames where ID belongs...");

  if (sourceTable !== "RecipesTable") {
    console.error(`By now, this only works for "RecipesTable"`);
    console.log("");
    process.exit(1);
  }

  const bindedJsonData = [];
  const searchFor = ["Ingredient", "Result"];

  // The JSON containing template itemName & XX_ID
  const itemToTemplateFile = await readJsonFile(
    sourceFolder,
    "ItemNameToTemplateID"
  );

  dataTable.forEach((element) => {
    // For every "Ingredient" and "Result"
    for (let j = 0; j < searchFor.length; j++) {
      // We know 1 is min and 4 is max of each
      for (let i = 1; i <= 4; i++) {
        const resultId = element[`${searchFor[j]}${[i]}ID`];

        if (resultId != 0) {
          const found = itemToTemplateFile.find((item) => {
            return item.ID_XX == element[`${searchFor[j]}${[i]}ID`];
          });

          element[`${searchFor[j]}${[i]}Name`] =
            found?.RowName ??
            `NotFound: ${
              element[`${searchFor[j]}${[i]}ID`]
            }, probly a Bazaar/DLC/BP item`;
        }
      }
    }

    // For "Catalyst"
    if (element.CatalystID != 0) {
      const found = itemToTemplateFile.find((item) => {
        return item.ID_XX == element.CatalystID;
      });

      element.CatalystName =
        found?.RowName ??
        `NotFound: ${element.CatalystID}, probly a Bazaar/DLC/BP item`;
    }

    // process.exit(1);
    bindedJsonData.push(element);
  });

  console.log("Done.");

  return bindedJsonData;
}

async function wirteFileToDisk(finalJson, operationName) {
  console.warn("\nWriting file to disk...");

  const filename = `${destFolder}/${sourceTable}_${operationName}.json`;

  // Write file
  writeFile(filename, JSON.stringify(finalJson, null, 2), function (err) {
    if (err) {
      console.log(err);
    }
  });

  console.log("Done.");
}

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

  const dataTable = await readJsonFile(sourceFolder, sourceTable);
  const rowsToAffect = await fillRowNames(dataTable[0]);
  let finalJson = {};
  let operationName = "";

  if (option == "1") {
    finalJson = await removeNSLOCTEXT(dataTable, rowsToAffect);
    operationName = "removeNSLOCTEXT";
  } else if (option == "2") {
    finalJson = await bindItemNameToDataTable(dataTable);
    operationName = "bindItemNameToID";
  } else if (option == "3") {
    const bindedJson = await bindItemNameToDataTable(dataTable);
    finalJson = await removeNSLOCTEXT(bindedJson, rowsToAffect);
    operationName = "bothOps";
  }

  await wirteFileToDisk(finalJson, operationName);

  console.log("Finished.");
} else {
  console.error(`Invalid option: ${option}`);
  process.exit(1);
}

rl.close();

