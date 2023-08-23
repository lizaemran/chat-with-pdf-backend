const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  type: String,
  nameAirport: String,
  latitudeAirport: Number,
  longitudeAirport: Number,
  iso_region: String,
  municipality: String,
  codeIcaoAirport: String,
  iata_code: String,
  loc:{
    "lon" : {
      type:Number,
    },
    "lat" : {
      type:Number,
    }
  },
});

const Airport2 = mongoose.model('airport2', airportSchema);

module.exports = {Airport2};