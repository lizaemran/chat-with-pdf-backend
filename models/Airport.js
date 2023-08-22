const mongoose = require("mongoose");

const AirportSchema = new mongoose.Schema({
    airportId: Number,
    codeIataAirport: String,
    nameAirport: String,
    codeIso2Country: String,
    codeIcaoAirport: String,
    codeIataCity: String,
    latitudeAirport: Number,
    longitudeAirport: Number,
    loc:{
      "lon" : {
        type:Number,
      },
      "lat" : {
        type:Number,
      }
    },
    timezone: String,
    GMT: Number,
    isRailRoad: Number,
    isBusStation: Number,
    nameTranslations: String,
    popularity: Number,
    phone: String,
    website: String,
    geonameId: Number,
    routes: Number,
    nameCountry: String
  })
  
let Airport = mongoose.model("Airport", AirportSchema);
module.exports = { Airport };