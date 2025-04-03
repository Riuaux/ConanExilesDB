# ConanExilesDB parser

### Simple and minimal data parser for Conan Exiles databases of items and recipes.

> Depends on `Node.js fs/promises` so Node is required to execute the `.mjs` files, just run `node main.msj`.

> Doesn't have a lot of error boundaries of the user input, so if you are typing a filename, or folder location, make sure it's a valid name and an existing dir.

> It's not like a big prject, so some things could be improved but not by now.

> It's assumed that the user knows the JSON structure of the DevKit DataTables (or can grab an idea of it) in order to modify/execute this commands.

> The project uses `writeFile` and that is **DESTRUCTIVE**, beacuse it overwrites the result file, so have a backup of your DTs if those are not the vanilla from DevKit.

> Convert the parsed JSON file to SQL (many kinds) on https://www.convertjson.com/json-to-sql.htm

## Why?

> TL;DR: Local database using just the info I need.

I want to make a simple web helper for Conan Exiles for materials required to build/create items/structures (and maybe, later on, a resource-calculator too, idk). There's some of those out there, but mostly are paginated (why??), inconsistent on results, or similar, so I'm trying to grab all the data from the game to just mount a local db and push some queries to get the results the way I want.

To achieve this, clearly I need a db of the game, but I have not found any for this game that are just open-to-download (no web-scrapping or server-intercepts things), so I decided to try to do one. The game itself (rather Unity) encrypt the files so runtime-grabbing doesn't work (add xkcd pointers reference), but the free _Unity DevKit for Conan Sanbox on Epic Games for modders_ let you export the DataTables (a sort of manipulated tables from the locked OG db) as JSON so I though I could build my own db on MongoDB or even convert those JSON to SQL and mount a SQLite or PostresQL localhost to fulfill this neccesity. So, here I am, tinkering with node and JSON files to parse/merge/mod the open data and build my own.

Are these files/db already on the wild, achieved by some Conan modder, just waiting for me to ask them in the Discord mod community if they could gift that to me? Probably yes. Have I asked? No, I could, but I'm having fun/stress dealing with this (will do if I give up or end up bored). Will this work? I don't know, at least until now, yes. Will I export/build/parse all the game DB? No way, mostly Recipes and Items and it's requirements. Will this be open for any random that, like me, wants a database of this game's items/recipes? Sure thing, that's why this repo is public.

## What it does

- Uses the JSON files from DevKit's DataTables to export a new file with no "NSLOCTEXT..." strings, and formats it to be ready to convert to SQL or be imported to MongoDB.
- Will only use exported data from DevKit, so no mod content is included in this files, but you can modify this script to your needs.

## May or may not be implemented

- Bring back a lot of comments that were deleted when refactoring.
- WIP: An option to merge files to have a single JSON file (source of truth) to be used as (heavy, ~60MB) local JSON "database", avoiding the neccesity of making queries to a DB.
- WIP: Add some sort of better automation on prompts to avoid typing DT names manually for each run.

## File versions in this repo

- Date of JSON extractions from DevKit: `2025-03-31`
- Epic Games app - Conan Exiles DevKit version: `1311351.43706`
- Epic Games Unreal Editor - Conan Sandbox version: `4.15.3-1311351+ue415-dw-osl`
- Conan Exiles (Steam Build ID) version: `17669764`
