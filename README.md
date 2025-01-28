# Cocktail Search Engine

## <font color="green">GET</font> /
```
http://127.0.0.1:5000/
```
Returns the file `index.html`.

## <font color="green">GET</font> /ingredients returns JSON with array
```
http://127.0.0.1:5000/ingredients
```
Returns JSON data with an array of all the ingredients in the drinks. Has no query parameters.
#### Example Request
```cmd
curl http://127.0.0.1:5000/ingredients
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

## <font color="green">GET</font> /search returns JSON with recipes
```
http://127.0.0.1:5000/search
```
Returns recipes in the API.
#### Query Params
##### `ingredients` | string | Optional | Defaults to 'all'
The ingredient which is included in all the recipes returned by the API. By default has value `'all'` which does not filter by ingredients.

##### `maxIngredients` | integer | Optional | Defaults to 15
The maximum number of ingredients in each of the recipes returned by the API. Must be within the range 2 to 15 inclusive. By default has value 15 which does not filter by number of ingredients. If `maxIngredients` is out of range, the HTTP code 422 is returned instead of JSON data.

#### Example Request 1 - Valid search with results
```cmd
curl "http://127.0.0.1:5000/search?ingredients=tonic%20water&maxIngredients=2"
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
curl "http://127.0.0.1:5000/search?ingredients=cola&maxIngredients=2"
```
#### Response
```JSON
{
    "drinks": null
}
```
#### Example Request 3 - Invalid search
```cmd
curl "http://127.0.0.1:5000/search?ingredients=tonic%20water&maxIngredients=1"
```
#### Response
```
Unprocessable Entity
```

## <font color="orange">POST</font> /submit
```
http://127.0.0.1:5000/submit
```
Adds a recipe to the API.
#### Request Body
##### `strName` | string | Required
The name of the drink.
##### `strInstructions` | string | Required
The instructions for making the drink.
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
#### Returns
HTTP code depending of if request is successful (200) or not (422).

```
Unprocessable Entity
```
