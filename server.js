const app = require("./app");
const PORT = 8080;
app.listen(PORT, function(err){
    if (err){console.log("Error in server setup")}
    console.log("http://127.0.0.1:"+PORT)
});