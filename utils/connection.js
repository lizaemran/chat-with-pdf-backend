const mongoose = require('mongoose');
const { mongo } = require('../config/environment');
function getConnection() {
  mongoose.connect(mongo.db_url,mongo.options)
  mongoose.connection.on('connected', () =>{
  
    console.log("db connected")
  })
  mongoose.connection.on('error', (err) => {
    console.log("Error",err)
  })
}


module.exports = { getConnection }