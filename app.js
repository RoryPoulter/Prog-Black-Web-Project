// Install required packages
const fs = require('fs');
const express = require("express");
const app = express();

// Creates the file `data.json` if it does not exist
if (!fs.existsSync("./data/data.json")){
    let str_data = JSON.stringify({reviews:[]});
    fs.writeFileSync("./data/data.json", str_data);
}
// Loads content from `data.json`
const obj_json_content = require("./data/data.json");

app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

// Sends the HTML body to the client when visiting the url
app.get("/", function(req, resp){
    resp.sendFile("client/index.html");
});

// Gets the reviews with a certain amount of stars
app.get("/stars/:stars", function(req, resp){
    let number_stars = parseInt(req.params.stars);
    let obj_data = {reviews: []};
    for (let obj_review of obj_json_content.reviews){
        if (obj_review.numberStars == number_stars){
            obj_data.reviews.push(obj_review);
        };
    };
    if (obj_data.reviews.length == 0){
        obj_data.reviews = null;
    }
    resp.send(obj_data);
});

// Checks the form data for repeated names and either appends to data.json or sends an error
app.post("/review", function(req, resp){
    // Gets form data
    let str_new_name = req.body.name.toUpperCase();
    let str_new_comment = req.body.comment;
    let number_new_stars = req.body.stars;
    // Formats the date into a string
    let str_current_date = new Date().toJSON().slice(0, 10);
    // Checks if there is a review with the same name
    for (let obj_review of obj_json_content.reviews){
        if (obj_review.strName == str_new_name){
            resp.send("error");
            return;
        }
    }
    // Formats data as object
    let obj_new_review = {
        strName: str_new_name,
        strDate: str_current_date,
        numberStars: number_new_stars,
        strComment: str_new_comment
    };
    // Pushes review to `data.json`
    obj_json_content.reviews.push(obj_new_review);
    let str_data = JSON.stringify(obj_json_content);
    fs.writeFileSync("./data/data.json", str_data);
    resp.send("success");
})

module.exports = app;