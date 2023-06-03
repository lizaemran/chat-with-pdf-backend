require("dotenv").config()
const express = require('express');
const cors = require("cors");
const expressFileupload = require("express-fileupload");
const routes = require("./routes")
const app = express();
const port = process.env.PORT
const database = require('./utils/connection');




// Enable cors
app.use(cors({
  origin: '*'
}));

app.use(expressFileupload())
// enable req.body
app.use(express.json())

// connect to db
database.getConnection();



app.use("/api",routes)

// default / route
app.get("/", async (_, res) => {
  res.send("Server is up...");
});


// Server listening
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});


