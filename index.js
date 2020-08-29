// SERVER SIDE
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var admin = require("firebase-admin");
app.use(bodyParser.json());


app.listen(3000)