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
  databaseURL: "https://icontribute2-dbf5e.firebaseio.com"
});

const firestore = admin.firestore;

app.get("/events", async (req, res) => {
  console.log();
  const snapshot = await firestore().collection("events").get();
  let newList = [];
  snapshot.forEach(doc => {
    newList.push(doc.data());
  });
  console.log("new list: ", newList);
  res.send(newList);
});

app.get("/user", async (req, res) => {
  await firestore()
    .collection("user")
    .get()
    .then(elements => {
      res.send(elements.docs[0].data());
    })
    .catch(e => res.error("error retrieving information"));
});

app.listen(5000);
