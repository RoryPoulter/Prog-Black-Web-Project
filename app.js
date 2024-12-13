// Install required packages
const fs = require('fs');
const express = require("express");
const app = express();

app.use(express.static('client'));
app.use(express.json());

app.get("/", function(req, resp){
    resp.sendFile("client/index.html");
});

module.exports = app;