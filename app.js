// Install required packages
const fs = require('fs');
const express = require("express");
const app = express();

// Creates the file `data.json` if it does not exist
if (!fs.existsSync("./client/data/data.json")){
    let data = JSON.stringify({drinks:[], ingredients:[]});
    fs.writeFileSync("./client/data/data.json", data);
}
// Loads content from `data.json`
const jsonContent = require("./client/data/data.json");
// const { parseArgs } = require('util');


app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

// Sends the HTML body to the client when visiting the url
app.get("/", function(req, resp){
    resp.sendFile("client/index.html");
});


// Adds the data to the JSON
app.post("/submit", function(req, resp){
    // Gets form data
    let newName = req.body.drinkName.toUpperCase();
    let newInstructions = req.body.drinkInst;
    let newIngredient1 = req.body.drinkIngr1;
    let newAmount1 = req.body.drinkIngrAm1;
    let newIngredient2 = req.body.drinkIngr2;
    let newAmount2 = req.body.drinkIngrAm2;
    let newIngredient3 = req.body.drinkIngr3 || null;
    let newAmount3 = req.body.drinkIngrAm3 || null;
    let newIngredient4 = req.body.drinkIngr4 || null;
    let newAmount4 = req.body.drinkIngrAm4 || null;
    let newIngredient5 = req.body.drinkIngr5 || null;
    let newAmount5 = req.body.drinkIngrAm5 || null;
    let newIngredient6 = req.body.drinkIngr6 || null;
    let newAmount6 = req.body.drinkIngrAm6 || null;
    let newIngredient7 = req.body.drinkIngr7 || null;
    let newAmount7 = req.body.drinkIngrAm7 || null;
    let newIngredient8 = req.body.drinkIngr8 || null;
    let newAmount8 = req.body.drinkIngrAm8 || null;
    let newIngredient9 = req.body.drinkIngr9 || null;
    let newAmount9 = req.body.drinkIngrAm9 || null;
    let newIngredient10 = req.body.drinkIngr10 || null;
    let newAmount10 = req.body.drinkIngrAm10 || null;
    let newIngredient11 = req.body.drinkIngr11 || null;
    let newAmount11 = req.body.drinkIngrAm11 || null;
    let newIngredient12 = req.body.drinkIngr12 || null;
    let newAmount12 = req.body.drinkIngrAm12 || null;
    let newIngredient13 = req.body.drinkIngr13 || null;
    let newAmount13 = req.body.drinkIngrAm13 || null;
    let newIngredient14 = req.body.drinkIngr14 || null;
    let newAmount14 = req.body.drinkIngrAm14 || null;
    let newIngredient15 = req.body.drinkIngr15 || null;
    let newAmount15 = req.body.drinkIngrAm15 || null;

    // Input Validation
    // Check for empty required inputs
    if (!newName || !newInstructions || !newIngredient1 || !newAmount1 || !newIngredient2 || !newAmount2){
        resp.send(422);
        return;
    }
    // Checks if there is a drink with the same name
    for (let drink of jsonContent.drinks){
        if (drink.strName == newName){
            resp.send(422);
            return;
        }
    }
    // Formats data as object
    let newDrink = {
        strName: newName,
        strInstructions: newInstructions,
        strImageName: newName + ".png",
        numberIngredients: 0,
        strIngredient1: newIngredient1,
        strIngredientAmount1: newAmount1,
        strIngredient2: newIngredient2,
        strIngredientAmount2: newAmount2,
        strIngredient3: newIngredient3,
        strIngredientAmount3: newAmount3,
        strIngredient4: newIngredient4,
        strIngredientAmount4: newAmount4,
        strIngredient5: newIngredient5,
        strIngredientAmount5: newAmount5,
        strIngredient6: newIngredient6,
        strIngredientAmount6: newAmount6,
        strIngredient7: newIngredient7,
        strIngredientAmount7: newAmount7,
        strIngredient8: newIngredient8,
        strIngredientAmount8: newAmount8,
        strIngredient9: newIngredient9,
        strIngredientAmount9: newAmount9,
        strIngredient10: newIngredient10,
        strIngredientAmount10: newAmount10,
        strIngredient11: newIngredient11,
        strIngredientAmount11: newAmount11,
        strIngredient12: newIngredient12,
        strIngredientAmount12: newAmount12,
        strIngredient13: newIngredient13,
        strIngredientAmount13: newAmount13,
        strIngredient14: newIngredient14,
        strIngredientAmount14: newAmount14,
        strIngredient15: newIngredient15,
        strIngredientAmount15: newAmount15,
    };
    

    let i = 1;
    while (i < 16 && newDrink["strIngredient"+i] != null){
        if (!jsonContent.ingredients.includes(newDrink["strIngredient"+i])){
            jsonContent.ingredients.push(newDrink["strIngredient"+i]);
        }
        i++;
    }
    newDrink.numberIngredients = i-1;
    // Pushes drink to `data.json`
    jsonContent.drinks.push(newDrink);
    let data = JSON.stringify(jsonContent);
    fs.writeFileSync("./client/data/data.json", data);
    resp.send(200);
});

// *Search GET methods
// Gets food from the menu based on diet and type
app.get("/search", function(req, resp){
    let searchIngredient = req.query.ingredients;
    let searchAmount = req.query.maxIngredients || 15;
    // If no ingredient is selected
    if (searchIngredient == "-------"){
        return
    };
    // Stores the JSON data to be returned
    let data = {drinks: []};
    // Iterate through the drinks
    for (let drink of jsonContent.drinks){
        if (drink.numberIngredients <= searchAmount){
            let allIngredients = new Array();
            for (let i = 1; i <= drink.numberIngredients; i++){
                allIngredients.push(drink["strIngredient"+i]);
            };
            if (allIngredients.includes(searchIngredient)){
                data.drinks.push(drink)
            }
        }
    };
    // If no drinks matched criteria
    if (data.drinks.length == 0){
        data.drinks = null
    };
    resp.send(data)
});

module.exports = app;