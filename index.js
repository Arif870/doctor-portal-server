const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());

// Database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.td49h.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("DoctorPortal");
    const appointmentCollection = database.collection("appoinments");
    const usersCollection = database.collection("users");

    app.get("/appointments", async (req, res) => {
      const email = req.query.email;
      const date = req.query.date;
      const query = { email: email, date: date };

      const cursor = appointmentCollection.find(query);
      const appoinments = await cursor.toArray();
      res.json(appoinments);
    });

    app.post("/appointments", async (req, res) => {
      const appoinment = req.body;
      const result = await appointmentCollection.insertOne(appoinment);

      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      const result = await usersCollection.insertOne(users);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Exprss");
});

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
