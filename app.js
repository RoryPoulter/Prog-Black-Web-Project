// ? Code for uploading files with multer adapted from https://github.com/bezkoder/express-file-upload
// Install required packages
const fs = require('fs');
const cors = require("cors");
const express = require("express");
const multer = require("multer");
const app = express();

const maxSize = 2 * 1024 * 1024;
global.__basedir = __dirname;
var corsOptions = {origin: "http://localhost:8081"};

// Creates the file `data.json` if it does not exist
if (!fs.existsSync("./client/data/data.json")){
    let data = JSON.stringify({drinks:[], ingredients:[]});
    fs.writeFileSync("./client/data/data.json", data);
}
// Loads content from `data.json`
const jsonContent = require("./client/data/data.json");

// Middleware
app.use(cors(corsOptions));
app.use(express.static("client"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies


// File handling
let storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, __basedir + "/client/uploads/");
	},
	filename: (req, file, cb) => {
        let fileName = req.body.strName.toUpperCase() + "." + file.originalname.split(".").slice(-1);
		cb(null, fileName);
	},
});

let uploadFilePromise = multer({
	storage: storage,
	limits: { fileSize: maxSize },
}).single("fileDrinkImage");


/**
 * Checks if a drink meets the search requirements
 * @param {object} drinkData The JSON data about the drink
 * @param {string} ingredient The ingredient which should be in the drink
 * @param {number} minAmount The minimum amount of ingredients allowed
 * @param {number} maxAmount The maximum amount of ingredients allowed
 * @returns {boolean} If the drink meets the search requirements
 */
function filterSearch(drinkData, ingredient, minAmount, maxAmount){
    if (drinkData.numberIngredients > maxAmount || drinkData.numberIngredients < minAmount){
        return false;
    }
    if (ingredient == "all"){
        return true;
    }
    for (let i = 1; i <= drinkData.numberIngredients; i++){
        if (drinkData["strIngredient"+i] == ingredient){
            return true;
        }
    }
    return false;
}


// * Route Methods
// Sends the HTML body for the home page
app.get("/", function(req, resp){
    resp.status(200).sendFile(__basedir + "/client/index.html");
});


// Sends the HTML body for the documentation
app.get("/docs", function(req, resp){
    resp.status(200).sendFile(__basedir + "/client/doc.html")
});


// Sends drinks from the JSON which meet search criteria
app.get("/search", function(req, resp){
    // Get query params and set null params to default values
    let searchIngredient = (req.query.ingredients || "all").toLowerCase();
    let minAmountIngredients = Number(req.query.minIngredients) || 2;
    let maxAmountIngredients = Number(req.query.maxIngredients) || 15;
    let searchOrder = (req.query.order || "oldest").toLowerCase();

    /** Input Validation:
     * 1. Check `minAmountIngredients` is not greater than `maxAmountIngredients`
     * 2. Check `minAmountIngredients` is in range 2 - 15 inclusive
     * 3. Check `maxAmountIngredients` is in range 2 - 15 inclusive
     * 4. Check `searchOrder` has valid value
     */
    if (minAmountIngredients > maxAmountIngredients){
        resp.status(400).send({error: `Query param minIngredients greater than maxIngredients (${minAmountIngredients} > ${maxAmountIngredients})`});
        return
    }
    if (minAmountIngredients < 2){
        resp.status(400).send({error: `Query param minIngredients out of range (${minAmountIngredients})`});
        return
    }
    if (maxAmountIngredients > 15){
        resp.status(400).send({error: `Query param maxIngredients out of range (${maxAmountIngredients})`});
        return
    }
    if (!["oldest", "newest", "least", "most"].includes(searchOrder)){
        resp.status(400).send({error: `Query param searchOrder value not valid (${searchOrder})`});
        return
    }

    // Stores the JSON data to be returned
    let data = {drinks: []};

    // Add the drinks which meet the criteria
    for (let drink of jsonContent.drinks){
        if (filterSearch(drink, searchIngredient, minAmountIngredients, maxAmountIngredients)){
            data.drinks.push(drink)
        }
    };

    // Order the search results
    if (searchOrder == "newest"){
        data.drinks.reverse();
    } else if (searchOrder == "least"){
        data.drinks.sort((a, b) => a.numberIngredients - b.numberIngredients);
    } else if (searchOrder == "most"){
        data.drinks.sort((a, b) => b.numberIngredients - a.numberIngredients);
    }

    // If no drinks matched criteria send null
    if (data.drinks.length == 0){
        data.drinks = null
    };
    resp.status(200).send(data)
});


// Sends all the ingredients from the JSON
app.get("/ingredients", function(req, resp){
    resp.status(200).send({ingredients: jsonContent.ingredients})
});


// Adds the data to the JSON
app.post("/submit", uploadFilePromise, function(req, resp){
    // Store request body as object and define undefined params as null
    let emptyFormData = {
        strName: null,
        strImagePath: null,
        strInstructions: null,
        numberIngredients: 0,
        strIngredient1: null,
        strIngredientAmount1: null,
        strIngredient2: null,
        strIngredientAmount2: null,
        strIngredient3: null,
        strIngredientAmount3: null,
        strIngredient4: null,
        strIngredientAmount4: null,
        strIngredient5: null,
        strIngredientAmount5: null,
        strIngredient6: null,
        strIngredientAmount6: null,
        strIngredient7: null,
        strIngredientAmount7: null,
        strIngredient8: null,
        strIngredientAmount8: null,
        strIngredient9: null,
        strIngredientAmount9: null,
        strIngredient10: null,
        strIngredientAmount10: null,
        strIngredient11: null,
        strIngredientAmount11: null,
        strIngredient12: null,
        strIngredientAmount12: null,
        strIngredient13: null,
        strIngredientAmount13: null,
        strIngredient14: null,
        strIngredientAmount14: null,
        strIngredient15: null,
        strIngredientAmount15: null
    };
    let newDrinkData = {...emptyFormData, ...req.body};
    // Set the image source as either the file if it exists else a placeholder image
    if (req.file != undefined){
        newDrinkData.strImagePath = "./uploads/" + req.file.filename;
    } else {
        newDrinkData.strImagePath = "https://placehold.co/200x200?text=No+Image";
    }

    /** Input Validation:
     * 1. Check only valid params are passed
     * 2. Check required params are not null (name, instructions, 2 ingredients with amounts)
     * 3. Check drink name is unique
     * 4. Check ingredients and amounts are in pairs
    */
    if (Object.keys(newDrinkData).length != 34){
        console.log(`Extra params passed (${Object.keys(newDrinkData).length})`);
        resp.status(400).send({error: `Extra params passed (${Object.keys(newDrinkData).length})`});
        return;
    }
    if (!newDrinkData.strName || !newDrinkData.strInstructions || !newDrinkData.strIngredient1 || !newDrinkData.strIngredientAmount1 || !newDrinkData.strIngredient2 || !newDrinkData.strIngredientAmount2){
        console.log("Missing required inputs");
        resp.status(400).send({error: "Missing required inputs"});
        return;
    }
    newDrinkData.strName = newDrinkData.strName.toUpperCase();
    for (let drink of jsonContent.drinks){
        if (drink.strName == newDrinkData.strName){
            console.log(`Name '${newDrinkData.strName}' is not unique`);
            resp.status(400).send({error: `Name ${newDrinkData.strName} is not unique`});
            return;
        }
    }
    for (let i = 1; i < 16; i++){
        //? (!a != !b) == (a XOR b) from user `John Kugelman` on https://stackoverflow.com/questions/4540422/why-is-there-no-logical-xor
        if (!newDrinkData["strIngredient"+i] != !newDrinkData["strIngredientAmount"+i]){
            console.log(`Ingredient-amount pair no. ${i} incomplete`);
            resp.status(400).send({error: `Ingredient-amount pair no. ${i} incomplete`});
            return;
        }
    }

    /** Input Sanitisation
     * 1. Change ingredients to lower case
     * 2. Shift ingredients to earliest position
     */
    let numberIngredients = 0;
    let ingredientAmountPairs = new Array();
    // Add ingredient-amount pairs to array
    for (let i = 1; i < 16; i++){
        let ingredient = newDrinkData["strIngredient"+i];
        if (ingredient){
            newDrinkData["strIngredient"+i] = ingredient.toLowerCase();
            ingredientAmountPairs.push([ingredient, newDrinkData["strIngredientAmount"+i]])
            // Add to ingredients list if not in data.json
            if (!jsonContent.ingredients.includes(ingredient)){
                jsonContent.ingredients.push(ingredient);
            }
            numberIngredients = numberIngredients + 1;
        }
    }
    // Shift all ingredient-amount pairs to the earliest free index
    for (let i = 1; i < 16; i++){
        if (i <= ingredientAmountPairs.length){
            newDrinkData["strIngredient"+i] = ingredientAmountPairs[i-1][0];
            newDrinkData["strIngredientAmount"+i] = ingredientAmountPairs[i-1][1];
        } else {
            newDrinkData["strIngredient"+i] = null;
            newDrinkData["strIngredientAmount"+i] = null;
        }
    }
    newDrinkData.numberIngredients = numberIngredients;
    // Pushes drink to `data.json`
    jsonContent.drinks.push(newDrinkData);
    let data = JSON.stringify(jsonContent);
    fs.writeFileSync("./client/data/data.json", data);
    resp.status(200).send({message: "Recipe uploaded successfully"});
});


// Deletes a drink from the JSON
app.delete("/delete/:recipe", function(req, resp){
    let drinkName = req.params.recipe;
    if (drinkName == undefined){
        resp.status(400).send({error: "Missing required input"});
        return;
    }
    drinkName = drinkName.toUpperCase();
    for (let i = 0; i < jsonContent.drinks.length; i++){
        if (jsonContent.drinks[i].strName == drinkName){
            jsonContent.drinks.splice(i, 1);
            let data = JSON.stringify(jsonContent);
            fs.writeFileSync("./client/data/data.json", data);
            resp.status(200).send({message: "Recipe successfully deleted"});
            return
        }
    }
    resp.status(400).send({error: `Recipe ${drinkName} not found`})
});


module.exports = app;