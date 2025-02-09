# Cocktail Search Engine
![GitHub Release](https://img.shields.io/github/v/release/RoryPoulter/Prog-Black-Web-Project)
![GitHub License](https://img.shields.io/github/license/RoryPoulter/Prog-Black-Web-Project)
[![GitHub last commit](https://img.shields.io/github/last-commit/RoryPoulter/Prog-Black-Web-Project.svg?style=flat)]()

### Contents
- [Usage](#usage)
  - [Installation](#installation)
  - [Using the web app](#using-the-web-app)
- [API Documentation](#api-documentation)
  - [GET /](#get)
  - [GET /ingredients](#get-ingredients-returns-json-with-array)
  - [GET /search](#get-search-returns-json-with-recipes)
  - [POST /submit](#post-submit)
  - [DELETE /delete/:recipe](#delete-deleterecipe)
# Usage
## Installation
Navigate to the directory in the terminal and run the command:
```cmd 
npm install
```
To test the program runs correctly, run the test cases using:
```cmd
npm test
```
If the program passes all the tests, run the server using:
```cmd
npm start
```
Open your browser and type `127.0.0.1:8080` in the URL bar.

## Using the web app
### Uploading Recipes
To add a new recipe, the following inputs are required:
* Drink name
* Drink instructions
* At least 2 ingredients with measurements

Recipes can have up to 15 ingredients and each must be listed with an amount. The amount of ingredients can be changed by clicking the `+`/`-` buttons.

An image can be uploaded but is not required; if no image is uploaded, the image below is displayed with the drink instead:

![placeholder image](https://placehold.co/200x200?text=No+Image)

When all inputs have been entered, press the `Share` button.

If the drink name is not unique, or there are missing required inputs, the recipe will not be posted.

### Searching Recipes
Recipes can be filtered based on if they contain a given ingredient and if the have at most a certain amount of ingredients. To show all recipes, the `ingredient` selection field should be left as `-------` (this does not filter by ingredients), move the slider to the right and click `Search`.

The order of results can be toggled to be either oldest to newest or vice versa.

If no recipes match the search criteria, the search results will not change.


### Deleting Recipes
Recipes can be deleted from the API. This can be done by entering the drink name into the form and clicking the `Submit` button. The input is not case sensitive.

# API Documentation
## <font color="green">GET</font> /
```
http://127.0.0.1:8080/
```
Returns the file `index.html`.

## <font color="green">GET</font> /ingredients
```
http://127.0.0.1:8080/ingredients
```
Returns JSON data with an array of all the ingredients in the drinks. Has no query parameters.
#### Example Request
```cmd
curl http://127.0.0.1:8080/ingredients
```
#### Response
```JSON
{
  "ingredients": [
    "vodka",
    "orange juice",
    "gin",
    "white rum",
    "dark rum",
    "tonic water",
    "cola",
    "cranberry juice",
    "simple syrup",
    "soda water",
    "mint leaves",
    "daiquiri bitters",
    "amaretto",
    "cherry brandy",
    "whole milk",
    "single cream",
    "spiced rum",
    "blue curaçao",
    "lime juice",
    "apple juice",
    "lemon-lime soda",
    "dry vermouth",
    "blanco tequila",
    "lemon juice",
    "bianco vermouth",
    "margarita bitters"
  ]
}
```

## <font color="green">GET</font> /search
```
http://127.0.0.1:8080/search
```
Returns recipes in the API.
#### Query Params
##### `ingredients` | string | Optional | Defaults to 'all'
The ingredient which is included in all the recipes returned by the API. By default has value `'all'` which does not filter by ingredients.

##### `maxIngredients` | integer | Optional | Defaults to 15
The maximum number of ingredients in each of the recipes returned by the API. Must be within the range 2 to 15 inclusive and be greater than or equal to `minIngredients`. By default has value 15 which does not filter by maximum number of ingredients. Returns 400 with an error if out of range.

##### `minIngredients` | integer | Optional | Defaults to 2
The minimum number of ingredients in each of the recipes returned by the API. Must be within the range 2 to 15 inclusive and be less than or equal to `maxIngredients`. By default has value 2 which does not filter by minimum number of ingredients. Returns 400 with an error if out of range.

##### `searchOrder` | string | Optional | Defaults to 'oldest'
The order in which the results are sorted. By default has a value of `'oldest'`. The values sort the results in the following ways:
* `'oldest'` - sort recipes in order they were added to the API
* `'newest'` - sort recipes in order the were added to the API; newest first
* `'least'` - sort recipes in ascending order by number of ingredients in the recipe
* `'most'` - sort recipes in descending order by number of ingredients in the recipe

#### Example Request 1 - Valid search with results
```cmd
curl "http://127.0.0.1:8080/search?ingredients=tonic%20water&maxIngredients=2"
```
#### Response
```JSON
{
  "drinks": [
    {
      "strName": "GIN & TONIC",
      "strInstructions": "Pour ingredients into ice-filled glass and serve",
      "strImageName": "GIN & TONIC.png",
      "numberIngredients": 2,
      "strIngredient1": "gin",
      "strIngredientAmount1": "50ml",
      "strIngredient2": "tonic water",
      "strIngredientAmount2": "120ml",
      "strIngredient3": null,
      "strIngredientAmount3": null,
      "strIngredient4": null,
      "strIngredientAmount4": null,
      "strIngredient5": null,
      "strIngredientAmount5": null,
      "strIngredient6": null,
      "strIngredientAmount6": null,
      "strIngredient7": null,
      "strIngredientAmount7": null,
      "strIngredient8": null,
      "strIngredientAmount8": null,
      "strIngredient9": null,
      "strIngredientAmount9": null,
      "strIngredient10": null,
      "strIngredientAmount10": null,
      "strIngredient11": null,
      "strIngredientAmount11": null,
      "strIngredient12": null,
      "strIngredientAmount12": null,
      "strIngredient13": null,
      "strIngredientAmount13": null,
      "strIngredient14": null,
      "strIngredientAmount14": null,
      "strIngredient15": null,
      "strIngredientAmount15": null
    },
    {
      "strName": "Vodka & Tonic",
      "strInstructions": "Pour ingredients into an ice-filled glass. Garnish with a lime wedge and serve",
      "strImageName": "VODKA & TONIC.png",
      "numberIngredients": 2,
      "strIngredient1": "vodka",
      "strIngredientAmount1": "50ml",
      "strIngredient2": "tonic water",
      "strIngredientAmount2": "120ml",
      "strIngredient3": null,
      "strIngredientAmount3": null,
      "strIngredient4": null,
      "strIngredientAmount4": null,
      "strIngredient5": null,
      "strIngredientAmount5": null,
      "strIngredient6": null,
      "strIngredientAmount6": null,
      "strIngredient7": null,
      "strIngredientAmount7": null,
      "strIngredient8": null,
      "strIngredientAmount8": null,
      "strIngredient9": null,
      "strIngredientAmount9": null,
      "strIngredient10": null,
      "strIngredientAmount10": null,
      "strIngredient11": null,
      "strIngredientAmount11": null,
      "strIngredient12": null,
      "strIngredientAmount12": null,
      "strIngredient13": null,
      "strIngredientAmount13": null,
      "strIngredient14": null,
      "strIngredientAmount14": null,
      "strIngredient15": null,
      "strIngredientAmount15": null
    }
  ]
}
```

#### Example Request 2 - Valid search without results
```cmd
curl "http://127.0.0.1:8080/search?ingredients=cola&maxIngredients=2"
```
#### Response
```JSON
{
    "drinks": null
}
```

#### Example Request 3 - Invalid search
```cmd
curl "http://127.0.0.1:8080/search?ingredients=tonic%20water&maxIngredients=1"
```
#### Response
```JSON
{
  "error": "Query param minIngredients out of range (1)"
}
```

## <font color="orange">POST</font> /submit
```
http://127.0.0.1:8080/submit
```
Adds a recipe to the API.
#### Request Body
##### `strName` | string | Required
The name of the cocktail.
##### `strInstructions` | string | Required
The instructions for making the cocktail.
##### `strIngredient1` | string | Required
The name of the first ingredient.
##### `strIngredientAmount1` | string | Required
The amount of the first ingredient.
##### `strIngredient2` | string | Required
The name of the second ingredient.
##### `strIngredientAmount2` | string | Required
The amount of the second ingredient.
##### `strIngredient3` - `strIngredient15` | string | Optional | Defaults to null
The name of the third to fifteenth ingredients.
##### `strIngredientAmount3` - `strIngredientAmount15` | string | Optional | Defaults to null
The amount of the third to fifteenth ingredients.
##### `fileDrinkImg` | file | Optional | Defaults to placeholder image
An image of the cocktail. If none is uploaded, a placeholder image is used.
#### Returns
HTTP code depending of if request is successful (200) or not (400).

#### Example Request 1 - Post with valid inputs
```cmd
curl http://127.0.0.1:8080/submit -H "Content-Type: application/json" -d "{\"strName\": \"screwdriver\",\"strInstructions\": \"Put ingredients in an ice-filled glass and stir with a screwdriver. Garnish with an orange slice.\",\"strIngredient1\": \"vodka\",\"strIngredientAmount1\": \"60ml\",\"strIngredient2\": \"orange juice\",\"strIngredientAmount2\": \"90ml\"}"
```
#### Response 1 - Drink is new
```JSON
{
  "message": "Recipe successfully uploaded"
}
```
#### Response 2 - Drink is not new
```JSON
{
  "error": "Name SCREWDRIVER is not unique"
}
```

#### Example Request 2 - Post with extra parameters
```cmd
curl http://127.0.0.1:8080/submit -H "Content-Type: application/json" -d "{\"extraParam\": \"extraInput\"}"
```
#### Response
```JSON
{
  "error": "Extra params passed (35)"
}
```

#### Example Request 3 - Post with missing required inputs
```cmd
curl http://127.0.0.1:8080/submit -H "Content-Type: application/json" -d "{\"strName\": \"screwdriver\",\"strIngredient1\": \"vodka\",\"strIngredientAmount1\": \"60ml\",\"strIngredient2\": \"orange juice\",\"strIngredientAmount2\": \"90ml\"}"
```
#### Response
```JSON
{
  "error": "Missing required inputs"
}
```

#### Example Request 4 - Incomplete ingredient-amount pairs
```cmd
curl http://127.0.0.1:8080/submit -H "Content-Type: application/json" -d "{\"strName\": \"screwdriver\",\"strInstructions\": \"Put ingredients in an ice-filled glass and stir with a screwdriver. Garnish with an orange slice.\",\"strIngredient1\": \"vodka\",\"strIngredientAmount1\": \"60ml\",\"strIngredient2\": \"orange juice\",\"strIngredientAmount2\": \"90ml\",\"strIngredient3\": \"triple sec\"}"
```
#### Response
```JSON
{
  "error": "Ingredient-amount pair no. 3 incomplete"
}
```

## <font color="red">DELETE</font> /delete/:recipe
```
http://127.0.0.1:8080/delete/
```
Deletes a recipe from the API.
#### Query Params
##### `recipe` | string | Required
The name of the recipe to be deleted from the API. Not case sensitive.
#### Example Request 1 - Request with drink
```cmd
curl "http://127.0.0.1:8080/delete/artlantic"
```
#### Response 1 - Drink exists
```JSON
{
  "message": "Recipe successfully deleted"
}
```
#### Response 2 - Drink does not exist
```JSON
{
  "error": "Recipe ATLANTIC not found"
}
```
#### Example Request 2 - Request with no drink
```cmd
curl "http://127.0.0.1:8080/delete/"
```
#### Response
```JSON
{
  "error": "Missing required input"
}
```