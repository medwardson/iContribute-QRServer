// SERVER SIDE
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var admin = require("firebase-admin");
app.use(bodyParser.json());

var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://icontribute2-dbf5e.firebaseio.com",
});

const firestore = admin.firestore;

app.get("/user", async (req, res) => {
  await firestore()
    .collection("user")
    .get()
    .then((elements) => {
      console.log("firestore data call for user 1:");
      console.log(elements.docs[0].data());
      res.send(elements.docs[0].data())
    }).catch(e => res.error('error retrieving information'));
});

app.listen(5000);
