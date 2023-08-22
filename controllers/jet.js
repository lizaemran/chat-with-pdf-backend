let { Airport } = require("../models/Airport");
// let mongoose = require("mongoose");
// const axios = require("axios");
exports.getAllJetInfo = async (req, res) => {
  let from = req.params.fromLocation;
  let to = req.params.to;
  let tourType = req.params.tourType;
  // let lat1 = req.params.lat1;
  // let lon1 = req.params.lon1;
  // let lat2 = req.params.lat2;
  // let lon2 = req.params.lon2;

  if (!from)
    return res.status(403).json({
      data: "",
      error: "please provide from",
    });
  if (!to)
    return res.status(403).json({
      data: "",
      error: "please provide to",
    });
  if (!tourType)
    return res.status(403).json({
      data: "",
      error: "please provide tourType",
    });
  // if (!lat1)
  //   return res.status(403).json({
  //     data: "",
  //     error: "please provide lat1",
  //   });
  // if (!lon1)
  //   return res.status(403).json({
  //     data: "",
  //     error: "please provide log1",
  //   });
  // if (!lat2)
  //   return res.status(403).json({
  //     data: "",
  //     error: "please provide log2",
  //   });
  // if (!lon2)
  //   return res.status(403).json({
  //     data: "",
  //     error: "please provide log2",
  //   });

  let jetInfo = [
    {
      type: "Turbo prop",
      rate: 4900,
      capacity: "6-8",
      speed: 643.738, //kph
      time: 0,
      cost: 0,
      img2: "https://jetlevel.com/wp-content/uploads/2023/08/Turbo_prop-int.jpeg",
      img1: "https://jetlevel.com/wp-content/uploads/2023/08/Turbo_prop_-etx.jpeg",
    },
    {
      type: "Very light jet",
      rate: 5400,
      capacity: "4-5",
      speed: 643.738,
      time: 0,
      cost: 0,
      img2: "https://jetlevel.com/wp-content/uploads/2023/08/very-light-jet-int.jpg",
      img1: "https://jetlevel.com/wp-content/uploads/2023/08/very-light-jet-ext.png",
    },
    {
      type: "Light jet",
      rate: 6900,
      capacity: "6-8",
      speed: 724.205,
      time: 0,
      cost: 0,
      img2: "https://jetlevel.com/wp-content/uploads/2023/08/Light_jet-int.jpeg",
      img1: "https://jetlevel.com/wp-content/uploads/2023/08/Light_jet-ext.jpeg",
    },
    {
      type: "Mid size jet",
      rate: 7900,
      capacity: "7-9",
      speed: 804.672,
      time: 0,
      cost: 0,
      img2: "https://jetlevel.com/wp-content/uploads/2023/08/Midsize_jet-int.jpeg",
      img1: "https://jetlevel.com/wp-content/uploads/2023/08/Midsize_jet-ext.jpeg",
    },
    {
      type: "Super midsize jet",
      rate: 9000,
      capacity: "8-10",
      speed: 844.906,
      time: 0,
      cost: 0,
      img2: "https://jetlevel.com/wp-content/uploads/2023/08/Super-midsize-int.jpeg",
      img1: "https://jetlevel.com/wp-content/uploads/2023/08/Super-midsize-ext.jpeg",
    },
    {
      type: "Heavy jet",
      rate: 11000,
      capacity: "10-16",
      speed: 844.906,
      time: 0,
      cost: 0,
      img2: "https://jetlevel.com/wp-content/uploads/2023/08/heavy-int.jpeg",
      img1: "https://jetlevel.com/wp-content/uploads/2023/08/heavy-ext.jpeg",
    },
  ];
  let search = await Airport.findOne({
    codeIcaoAirport: { $regex: `${from}`, $options: "i" },
  });

  let search1 = await Airport.findOne({
    codeIcaoAirport: { $regex: `${to}`, $options: "i" },
  });

  const numericValue1 = search.latitudeAirport
  const numericValue2 = search.longitudeAirport
  const numericValue3 = search1.latitudeAirport
  const numericValue4 = search1.longitudeAirport

  let distance = await calculateDistance(
    numericValue1,
    numericValue2,
    numericValue3,
    numericValue4
  );
  await Promise.all(
    jetInfo.map(async (item, index) => {
      let timeInHours = distance / item.speed;
      jetInfo[index].time = timeInHours;
      if (tourType == "roundTrip") {
        jetInfo[index].cost = jetInfo[index].rate * jetInfo[index].time;
        jetInfo[index].cost *= 2;
      } else if (tourType == "oneWay") {
        jetInfo[index].cost = jetInfo[index].rate * jetInfo[index].time;
      }
    })
  );

  res.status(200).json({
    data: jetInfo,
  });
};
function toRad(num) {
  return (num * Math.PI) / 180;
}
async function calculateDistance(lat1, lon1, lat2, lon2) {
  // var lat2 = 40.642334;
  // var lon2 = -73.78817;
  // var lat1 = 28.432177;
  // var lon1 = -81.308304;

  var R = 6371; // km
  //has a problem with the .toRad() method below.
  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  console.log(d);
  return d;
}

exports.search = async (req, res) => {
  try {
    let input = req.query.query;
    //    ['codeIataAirport', 'codeIataCity','nameAirport', 'codeIso2Country', 'codeIcaoAirport','nameCountry','nameTranslations','timezone']:
    let search = [];
    if (input.length >= 3) {
      search = await Airport.find({
        $or: [
          { codeIataAirport: { $regex: input, $options: "i" } },
          { codeIataCity: { $regex: input, $options: "i" } },
          { nameAirport: { $regex: input, $options: "i" } },
          { codeIso2Country: { $regex: input, $options: "i" } },
          { codeIcaoAirport: { $regex: input, $options: "i" } },
          { nameCountry: { $regex: input, $options: "i" } },
          { nameTranslations: { $regex: input, $options: "i" } },
          { timezone: { $regex: input, $options: "i" } },
        ],
      });

      let nearBy = await Airport.find({
        loc: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [search[0].loc.lon, search[0].loc.lat],
            },
            // $minDistance: 1000,
            // $maxDistance: 5000
          },
        },
      }).limit(5);

      let combinedResults = search.concat(nearBy);

      // Create a map to track unique objects based on _id
      const uniqueMap = new Map();

      // Iterate through the combined results and remove duplicates based on _id
      for (const obj of combinedResults) {
        if (!uniqueMap.has(obj._id)) {
          uniqueMap.set(obj._id, obj);
        }
      }

      // Convert the map values back to an array (removing duplicates)
      const deduplicatedArray = Array.from(uniqueMap.values());

      search = deduplicatedArray;
    }

    res.send({ search });
  } catch (err) {
    console.log(err);
    res.send({ err: err });
  }
};

