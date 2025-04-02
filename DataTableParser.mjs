import fs from "fs";
import { readFile } from "fs/promises";

// Name of the raw json file exported from Mod Editor
// Usually are ItemTable, RecipesTable
const table = "ItemTable";
// Rows that contains NSLOCTEXT in its text
const prepend = ["Name", "ShortDesc", "LongDesc"];

// Read the json file
const jsonData = JSON.parse(
  await readFile(new URL(`./${table}.json`, import.meta.url))
);

// Loop for every json file added
jsonData.forEach((element) => {
  // Loop for every Row of prepend var
  for (let i = 0; i < prepend.length; i++) {
    // Remove NSLOCTEXT... text data
    let newName = element[prepend[i]];
    // Trim last chars remaining: a ")
    newName = newName
    .slice(0, newName.length - 2)
    .replace(
        `NSLOCTEXT("", "${table}_${element["RowName"]}_${prepend[i]}", "`,
        ""
      )
      ;

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

    console.log(newName);
  }

  process.exit(1);

  return element;
});

// if (jsonData[0].ItemName == undefined) {
//   console.log("ERROR: ItemName property not found 2");
//   process.exit(1);
// }

// Set name for new parsed file
const filename = `${table}_parsed.json`;

// Write file to same dir ./
fs.writeFile(filename, JSON.stringify(jsonData, null, 2), function (err) {
  if (err) {
    console.log(err);
  }
});

// Show only 1st item of final parsed json data
// console.log(jsonData[0]);

