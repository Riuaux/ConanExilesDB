import fs from "fs";
import { readFile } from "fs/promises";

// Name of the raw json file exported from DevKit
// Usually are ItemTable, RecipesTable
const table = "ItemTable";
// const table = "RecipesTable";

// Rows that contains NSLOCTEXT in its text
// Usually are Name, ShortDesc, LongDesc | RecipeName, ShortDesc
const prepend = ["Name", "ShortDesc", "LongDesc"];
// const prepend = ["RecipeName", "ShortDesc"];

// OG files exported from DevKit
const sourceFolder = "./JSON-DevKit/";
// Destination folder for parsed
const destinationFolder = "./JSON-Parsed/";

// Read the json file
const jsonData = JSON.parse(
  await readFile(new URL(`${sourceFolder}${table}.json`, import.meta.url))
);

// Container for parsed data that'll be saved
const newJsonData = [];

// Loop for every json file added
jsonData.forEach((element) => {
  // Loop for every Row of prepend var
  for (let i = 0; i < prepend.length; i++) {
    let newName = element[prepend[i]];
    newName = newName
      // Trim last chars (a double quote and a parenthesis)
      .slice(0, newName.length - 2)
      // Remove NSLOCTEXT... text data
      .replace(
        `NSLOCTEXT("", "${table}_${element["RowName"]}_${prepend[i]}", "`,
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

// Set name for new parsed file
const filename = `${destinationFolder}${table}_parsed.json`;

// Write file to same dir ./
fs.writeFile(filename, JSON.stringify(newJsonData, null, 2), function (err) {
  if (err) {
    console.log(err);
  }
});

// Show only 1st item of final parsed json data
console.log(newJsonData[0]);
