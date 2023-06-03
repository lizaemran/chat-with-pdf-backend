const mongoose = require('mongoose');
const { mongo } = require('../config/environment');
function getConnection() {
  mongoose.connect(mongo.db_url, mongo.options);
  mongoose.connection.on('connected', () =>{
    console.log('connection established');
  });

  mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err);
    reconnect()
  });
  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected');
   reconnect()
  });

}

function reconnect(){
  mongoose.connect(mongo.db_url, mongo.options);
  console.log("reconnected database")
}

module.exports = { getConnection }