// Install required packages
const fs = require('fs');
const express = require("express");
const app = express();
const jsonContent = require("./data/data.json");

app.use(express.static('client'));
app.use(express.json());

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

module.exports = app;