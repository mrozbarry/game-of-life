var express = require("express");
var app = express();
var path = require("path");
app.use(express.static(__dirname + '/'));
app.listen(3000);
console.log("Server running at Port 3000");