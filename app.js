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
    console.log(req.body);
    let emptyFormData = {
        drinkName: null,
        drinkInst: null,
        drinkIngr1: null,
        drinkIngrAm1: null,
        drinkIngr2: null,
        drinkIngrAm2: null,
        drinkIngr3: null,
        drinkIngrAm3: null,
        drinkIngr4: null,
        drinkIngrAm4: null,
        drinkIngr5: null,
        drinkIngrAm5: null,
        drinkIngr6: null,
        drinkIngrAm6: null,
        drinkIngr7: null,
        drinkIngrAm7: null,
        drinkIngr8: null,
        drinkIngrAm8: null,
        drinkIngr9: null,
        drinkIngrAm9: null,
        drinkIngr10: null,
        drinkIngrAm10: null,
        drinkIngr11: null,
        drinkIngrAm11: null,
        drinkIngr12: null,
        drinkIngrAm12: null,
        drinkIngr13: null,
        drinkIngrAm13: null,
        drinkIngr14: null,
        drinkIngrAm14: null,
        drinkIngr15: null,
        drinkIngrAm15: null
    };
    let newDrinkData = {...emptyFormData, ...req.body};
    console.log(newDrinkData);
    /* Input Validation:
    1. Check only valid params are passed
    2. Check required params are not null (name, instructions, 2 ingredients)
    */
    // Check for empty required inputs
    if (Object.keys(newDrinkData).length != 32){
        resp.send(422);
        return;
    }
    if (!newDrinkData.drinkName || !newDrinkData.drinkInst || !newDrinkData.drinkIngr1 || !newDrinkData.drinkIngrAm1 || !newDrinkData.drinkIngr2 || !newDrinkData.drinkIngrAm2){
        resp.send(422);
        return;
    }
    // Checks if there is a drink with the same name
    for (let drink of jsonContent.drinks){
        if (drink.strName == newDrinkData.strName){
            resp.send(422);
            return;
        }
    }
    // Add new ingredients to data.json
    let i = 1;
    while (i < 16 && newDrinkData["strIngredient"+i] != null){
        if (!jsonContent.ingredients.includes(newDrinkData["strIngredient"+i])){
            jsonContent.ingredients.push(newDrinkData["strIngredient"+i]);
        }
        i++;
    }
    newDrinkData.numberIngredients = i-1;
    // Pushes drink to `data.json`
    jsonContent.drinks.push(newDrinkData);
    let data = JSON.stringify(jsonContent);
    fs.writeFileSync("./client/data/data.json", data);
    resp.send(200);
});

// *Search GET method
app.get("/search", function(req, resp){
    // Input validation
    let searchIngredient = (req.query.ingredients || "all").toLowerCase();
    let searchAmount = req.query.maxIngredients || 15;

    if (searchAmount < 2 || searchAmount > 15){
        resp.send(422);
    }

    // Returns all drinks in data.json
    if (searchIngredient == "all" && searchAmount == 15){
        resp.send({drinks: jsonContent.drinks});
        return
    };
    // Stores the JSON data to be returned
    let data = {drinks: []};
    // Iterate through the drinks
    for (let drink of jsonContent.drinks){
        if (drink.numberIngredients <= searchAmount){
            if (searchIngredient == "all"){
                data.drinks.push(drink);
            } else {
                for (let i = 1; i <= drink.numberIngredients; i++){
                    if (drink["strIngredient"+i] == searchIngredient){
                        data.drinks.push(drink);
                        break
                    }
                };
            }
        }
    };
    // If no drinks matched criteria
    if (data.drinks.length == 0){
        data.drinks = null
    };
    resp.send(data)
});

app.get("/ingredients", function(req, resp){
    resp.send({ingredients: jsonContent.ingredients})
});

module.exports = app;