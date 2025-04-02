# Simple and minimal parser for Conan Exiles databases of items and recipes.

> Depends on `NodeJS fs/promises` so node is required to execute the `.mjs` files, just run `node somefile.msj`.
> Looks for a folder named 

* Date of JSON extractions from DevKit: `2025-03-31`
* Epic Games app - Conan Exiles DevKit version: `1311351.43706`
* Epic Games Unreal Editor - Conan Sandbox version: `4.15.3-1311351+ue415-dw-osl`
* Conan Exiles (Steam Build ID) version: `17669764`

## What it does

* Uses the JSON files from DevKit's DataTables to export a new file with no "NSLOCTEXT..." strings, and formats it to be ready to convert to SQL or be imported to MongoDB.
* WIP: An option to parse files to bind item's ID to the desired DataTable using the dictionary `ItemNameToTemplateID`-DataTable, to have a single JSON file (source of truth) to be used as (heavy, ~30MB) local JSON database, avoiding the unreadability of the items names or IDs when making non-relational SQL queries.
* WIP: Add automation to avoid setting DT names and columns/properties manually for each run.
