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


let portException= false;

process.on('uncaughtException', (error, origin) => {
    console.log('----- Uncaught exception -----')
    console.log(error)
    console.log('----- Exception origin -----')
    console.log(origin)
    if(error.code == "EADDRINUSE"){
    portException= true;
    }
 

})

process.on('unhandledRejection', (reason, promise) => {
    console.log('----- Unhandled Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
  
})
process.on('Error', (reason, promise) => {
    console.log('----- Error Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})
process.on('error', (reason, promise) => {
    console.log('----- error Rejection at -----')
    console.log(promise)
    console.log('----- Reason -----')
    console.log(reason)
})
process.on('exit', (reason, promise) => {
    console.log("Server Exit Reason::::",reason)
    if(reason == 1){
  
    }else{
      console.log("Server is shutting down .......")
      server.close()
    }
})