SELECT
	-- RT.RowName,
	RT.RecipeName,
	RT.RecipeType,
	RT.TimeToCraft,
	RT.Tier,
	IT1.ItemName AS Ingredient1,
	RT.Ingredient1Quantity,
	IT2.ItemName AS Ingredient2,
	RT.Ingredient2Quantity,
	IT3.ItemName AS Ingredient3,
	RT.Ingredient3Quantity,
	IT4.ItemName AS Ingredient4,
	RT.Ingredient4Quantity,
	ITC.ItemName AS Catalyst
FROM
	recipestable AS RT
	LEFT JOIN itemtable AS IT1 ON RT.Ingredient1ID = IT1.RowName
	LEFT JOIN itemtable AS IT2 ON RT.Ingredient2ID = IT2.RowName
	LEFT JOIN itemtable AS IT3 ON RT.Ingredient3ID = IT3.RowName
	LEFT JOIN itemtable AS IT4 ON RT.Ingredient4ID = IT4.RowName
	LEFT JOIN itemtable AS ITC ON RT.CatalystID = ITC.RowName
WHERE
	RecipeName RLIKE 'dragon'
	AND RecipeType RLIKE 'Weapon|Armor'
	AND (
		IT1.ItemName RLIKE 'Star'
		OR IT2.ItemName RLIKE 'Star'
		OR IT3.ItemName RLIKE 'Star'
		OR IT4.ItemName RLIKE 'Star'
	)