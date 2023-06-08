const mongoose = require('mongoose');
const { mongo } = require('../config/environment');
function getConnection() {
  mongoose.connect(mongo.db_url,mongo.options).then(()=>{
    console.log("db connected")
  }).catch(err =>{
    console.log("Error",err)
  })

}


module.exports = { getConnection }