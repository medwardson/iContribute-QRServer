// SERVER SIDE
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
var admin = require("firebase-admin");
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

var serviceAccount = require("./service_account.json");

if (process.env.NODE_ENV === "production") {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVICE_ACCOUNT)),
    databaseURL: "https://icontribute2-dbf5e.firebaseio.com"
  });
} else {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://icontribute2-dbf5e.firebaseio.com"
  });
}

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
  res.send(newList);
});

app.post("/organizerEvents", async (req, res) => {
  console.log("req body email: ", req.body.email);
  const eventIDList = await (await firestore()
    .collection("user")
    .doc(req.body.email)
    .get())
    .get("event")
    .valueOf();
  console.log("eventID List: ", eventIDList);

  const eventData = [];
  for (const id of eventIDList) {
    const singleEvent = await firestore().collection("events").doc(id).get();
    eventData.push(singleEvent.data());
  }
  res.send(eventData);
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

app.post("/validate", async (req, res) => {
  const eventID = req.body.eventID;
  const shiftIndex = req.body.shiftIndex;
  const email = req.body.email;

  const eventIDList = await (await firestore()
    .collection("user")
    .doc(req.body.email)
    .get())
    .get("event")
    .valueOf();

  if (!eventIDList.includes(eventID))
    res.error("Sorry, you are not authorized to perform this action");
});

app.get("/health", async (req, res) => {
  res.send("200 MA DUDE");
});

app.listen(PORT);
