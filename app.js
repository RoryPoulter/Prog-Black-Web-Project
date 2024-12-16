// Install required packages
const fs = require('fs');
const express = require("express");
const app = express();
const jsonContent = require("./data/data.json");

app.use(express.static('client'));
app.use(express.json());
app.use(express.urlencoded({ extended: false })); //Parse URL-encoded bodies

app.get("/", function(req, resp){
    resp.sendFile("client/index.html");
});

// Gets the reviews with a certain amount of stars
app.get("/stars/:stars", function(req, resp){
    stars = parseInt(req.params.stars);
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

app.post("/review", function(req, resp){
    // Gets form data
    let name = req.body.name;
    let comment = req.body.comment;
    let stars = req.body.stars;
    // Formats the date into a string
    let date = new Date().toJSON().slice(0, 10);
    // Checks if there is a review with the same name
    for (let review of jsonContent.reviews){
        if (review.name == name){
            resp.send("error");
            return;
        }
    }
    // Formats data as object
    let new_review = {
        strName: name,
        strDate: date,
        numberStars: stars,
        strComment: comment
    };
    // Pushes review to `data.json`
    jsonContent.reviews.push(new_review);
    let data = JSON.stringify(jsonContent);
    fs.writeFileSync("./data/data.json", data);
    resp.send("success");
})

module.exports = app;