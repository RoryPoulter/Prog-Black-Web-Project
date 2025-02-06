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


app.use(cors(corsOptions));
app.use(express.static("client"));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies


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


// Sends the HTML body to the client when visiting the url
app.get("/", function(req, resp){
    resp.status(200).sendFile(__basedir + "/client/index.html");
});


app.get("/docs", function(req, resp){
    resp.status(200).sendFile(__basedir + "/client/doc.html")
})


// Adds the data to the JSON
app.post("/submit", uploadFilePromise, function(req, resp){
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
    // Flags for if the ordering is valid
    let foundNull = false;  // Changed to `true` after first `null` is found
    let isValid = true;  // Changed to `false` after ingredient found after `null`
    let ingredientAmountPairs = new Array();
    for (let i = 1; i < 16; i++){
        let ingredient = newDrinkData["strIngredient"+i];
        if (ingredient){
            newDrinkData["strIngredient"+i] = ingredient.toLowerCase();
            ingredientAmountPairs.push([ingredient, newDrinkData["strIngredientAmount"+i]])
            // Add to list if not in data.json
            if (!jsonContent.ingredients.includes(ingredient)){
                jsonContent.ingredients.push(ingredient);
            }
            numberIngredients = numberIngredients + 1;
            if (foundNull && isValid){
                isValid = false;
            }
        } else if (!foundNull){
            foundNull = true;
        }
    }
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


// * GET methods
app.get("/search", function(req, resp){
    // Input validation
    let searchIngredient = (req.query.ingredients || "all").toLowerCase();
    let minAmountIngredients = req.query.minIngredients || 2;
    let maxAmountIngredients = req.query.maxIngredients || 15;
    let isOldestFirst = (req.query.order || "oldest") == "oldest";

    /** Input Validation:
     * 1. Check `minAmountIngredients` is not greater than `maxAmountIngredients`
     * 2. Check `minAmountIngredients` is in range 2 - 15 inclusive
     * 3. Check `maxAmountIngredients` is in range 2 - 15 inclusive
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
    // Stores the JSON data to be returned
    let data = {drinks: []};
    for (let drink of jsonContent.drinks){
        if (filterSearch(drink, searchIngredient, minAmountIngredients, maxAmountIngredients)){
            data.drinks.push(drink)
        }
    };
    if (!isOldestFirst){
        data.drinks.reverse();
    }

    // If no drinks matched criteria
    if (data.drinks.length == 0){
        data.drinks = null
    };
    resp.status(200).send(data)
});

app.get("/ingredients", function(req, resp){
    resp.status(200).send({ingredients: jsonContent.ingredients})
});

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
})

module.exports = app;