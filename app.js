// Install required packages
const fs = require('fs');
const express = require("express");
const app = express();

// Creates the file `data.json` if it does not exist
if (!fs.existsSync("./client/data/data.json")){
    let data = JSON.stringify({reviews:[]});
    fs.writeFileSync("./client/data/data.json", data);
}
// Loads content from `data.json`
const jsonContent = require("./client/data/data.json");
const { parseArgs } = require('util');

app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

// Sends the HTML body to the client when visiting the url
app.get("/", function(req, resp){
    resp.sendFile("client/index.html");
});

// *Review GET / POST methods
// Gets the reviews with a certain amount of stars
app.get("/stars/:stars", function(req, resp){
    let stars = parseInt(req.params.stars);
    let data = {reviews: []};
    for (let review of jsonContent.reviews){
        if (review.numberStars == stars){
            data.reviews.push(review);
        };
    };
    if (data.reviews.length == 0){
        data.reviews = null;
    }
    resp.send(data);
});

app.get("/all", function(req, resp){
    resp.send(jsonContent)
})

// Checks the form data for repeated names and either appends to data.json or sends an error
app.post("/review", function(req, resp){
    // Gets form data
    let newName = req.body.strName.toUpperCase();
    let newComment = req.body.strComment;
    let newStars = Number(req.body.numberStars);
    // Formats the date into a string
    let currentDate = new Date().toJSON().slice(0, 10);

    // Input Validation
    // Check for empty inputs
    if (!newName || !newComment){
        resp.send("hello");
        return;
    }
    // Checks if there is a review with the same name
    for (let review of jsonContent.reviews){
        if (review.strName == newName){
            resp.send(422);
            return;
        }
    }
    // Formats data as object
    let newReview = {
        strName: newName,
        strDate: currentDate,
        numberStars: newStars,
        strComment: newComment
    };
    // Pushes review to `data.json`
    jsonContent.reviews.push(newReview);
    let data = JSON.stringify(jsonContent);
    fs.writeFileSync("./client/data/data.json", data);
    resp.send(200);
});

// *Food GET / POST methods
/**
 * Gets all the vegetarian dishes from the menu
 * @returns {object} The JSON data of all the vegetarian dishes
 */
function getVegetarianDishes(){
    let data = {food: []};
    for (let food of jsonContent.food){
        if (food.boolVegetarian){
            data.food.push(food)
        }
    };
    return data
};

/**
 * Gets all the vegan dishes form the menu
 * @returns {object} The JSON data of all the vegan dishes
 */
function getVeganDishes(){
    let data = {food: []};
    for (let food of jsonContent.food){
        if (food.boolVegan){
            data.food.push(food)
        }
    };
    return data
};

// Gets all vegetarian food from the menu
app.get("/food/vegetarian", function(req, resp){
    resp.send(getVegetarianDishes())
});

// Gets all vegan food from the menu
app.get("/food/vegan", function(req, resp){
    resp.send(getVeganDishes())
});

// Gets all food from the menu
app.get("/food/all", function(req, resp){
    resp.send(jsonContent.food)
});

app.get("/food", function(req, resp){
    let diet = req.query.diet;
    if (diet == "all"){
        resp.send(jsonContent.food);
    } else if (diet == "vegetarian") {
        resp.send(getVegetarianDishes());
    } else {
        resp.send(getVeganDishes());
    }
})

module.exports = app;