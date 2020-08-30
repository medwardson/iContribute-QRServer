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
  const snapshot = await firestore().collection("events").get();
  let newList = [];
  snapshot.forEach(doc => {
    newList.push(doc.data());
  });
  console.log("new list: ", newList);
  res.send(newList);
});

app.post("/organizerEvents", async (req, res) => {
  
  console.log('req body email: ', req.body.email);
  const snapshot = await firestore().collection("user").doc(req.body.email).get()
  
  let newList = [];
  snapshot.data().event.forEach(doc => {
    newList.push(doc);
  });

  let returnList = [];
  // const ret = async () => {
  // await newList.forEach(async (eventID) => {
    await firestore().collection("events").doc(newList[0]).get().then(event => {
      console.log(event.data())
      returnList.push(event.data());
    });
  //   })
  // })}

  // ret();

  console.log('return list: ', returnList);
  console.log('newlist: ', newList);
  res.send(returnList);
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
