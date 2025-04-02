import fs from "fs";
import { readFile } from "fs/promises";

// Name of the raw json file exported from DevKit
// Usually are ItemTable, RecipesTable
// const sourceTable = "ItemTable";
const sourceTable = "RecipesTable";

// The item-to-ID template when requires binding
const bridgeTable = "ItemNameToTemplateID";

// OG files exported from DevKit
const sourceFolder = "./JSON-DevKit/";
// Destination folder for parsed
const parsedFolder = "./JSON-Parsed/";
// Destination folder for binded when calling bindItemNameToDataTable()
const bindedFolder = "./JSON-Binded/";

// Set name and location for new parsed file
let filename = `${parsedFolder}${sourceTable}_parsed.json`;

// Read the json file
const jsonDataTable = JSON.parse(
  await readFile(new URL(`${sourceFolder}${sourceTable}.json`, import.meta.url))
);

// Only required if binding items ID to itemsName when calling bindItemNameToDataTable()
const jsonTemplateTable = JSON.parse(
  await readFile(new URL(`${sourceFolder}${bridgeTable}.json`, import.meta.url))
);

// Container for parsed data that'll be saved
const newJsonData = [];

function removeNSLOCTEXT() {
  // Rows that contains NSLOCTEXT in its text
  // Usually are Name, ShortDesc, LongDesc | RecipeName, ShortDesc
  const prepend = ["Name", "ShortDesc", "LongDesc"];
  // const prepend = ["RecipeName", "ShortDesc"];

  // Loop for every json file added
  jsonDataTable.forEach((element) => {
    // Loop for every Row of prepend var
    for (let i = 0; i < prepend.length; i++) {
      let newName = element[prepend[i]];
      newName = newName
        // Trim last chars (a double quote and a parenthesis)
        .slice(0, newName.length - 2)
        // Remove NSLOCTEXT... text data
        .replace(
          `NSLOCTEXT("", "${sourceTable}_${element["RowName"]}_${prepend[i]}", "`,
          ""
        );

      // Overwrite old text data with parsed one
      element[prepend[i]] = newName;

      // Replace "Name" property to "ItemName" to avoid SQL cloumn name problems
      if (prepend[i] == "Name") {
        element = {
          // Set this property as first one, cloning object
          ItemName: element[prepend[i]],
          ...element,
        };
        // Remove old "Name" property
        delete element["Name"];
      }
    }

    // process.exit(1);
    newJsonData.push(element);
  });
}

function bindItemNameToDataTable() {
  // Loop for every json file added
  jsonDataTable.forEach((element) => {
    // Search sourceTable for every "Ingredient-ID", from 1 to max 4 (Ingredient4ID)
    for (let i = 1; i <= 4; i++) {
      if (element[`Ingredient${i}ID`] != 0) {
        // Then, if found, and if not 0, search the bridgeTable for the item name under "ID_XX" property
        const found = jsonTemplateTable.find((item) => {
          return item.ID_XX == element[`Ingredient${i}ID`];
        });

        // Finally, add that found prop to the ingredient name
        element[`Ingredient${i}Name`] =
          found?.RowName ??
          `NotFound: ${
            element[`Ingredient${i}ID`]
          }, probly a Bazaar/DLC/BP item`;
      }
    }

    // Search sourceTable for every "Result-ID", from 1 to max 4 (Result4ID)
    for (let i = 1; i <= 4; i++) {
      if (element[`Result${i}ID`] != 0) {
        // Then, if found, and if not 0, search the bridgeTable for the item name under "ID_XX" property
        const found = jsonTemplateTable.find((item) => {
          return item.ID_XX == element[`Result${i}ID`];
        });

        // Finally, add that found prop to the result name
        element[`Result${i}Name`] =
          found?.RowName ??
          `NotFound: ${element[`Result${i}ID`]}, probly a Bazaar/DLC/BP item`;
      }
    }

    // Same as above, but for the single "CatalystID"
    if (element["CatalystID"] != 0) {
      const found = jsonTemplateTable.find((item) => {
        return item.ID_XX == element["CatalystID"];
      });
      element["CatalystName"] =
        found?.RowName ??
        `NotFound: ${element["CatalystID"]}, probly a Bazaar/DLC/BP item`;
    }

    // process.exit(1);
    newJsonData.push(element);
  });

  // Replace name and location for new binded file
  filename = `${bindedFolder}${sourceTable}_binded.json`;
}

// ================================
// Call one of this

// removeNSLOCTEXT();
bindItemNameToDataTable();

// ================================

// Write file
fs.writeFile(filename, JSON.stringify(newJsonData, null, 2), function (err) {
  if (err) {
    console.log(err);
  }
});

// Show only 1st item of final parsed json data
console.log(newJsonData[0]);
