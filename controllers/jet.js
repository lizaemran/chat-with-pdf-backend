// const axios = require("axios");
exports.getAllJetInfo = async (req, res) => {
  try {
    let from = req.params.from;
    let to = req.params.to;
    let tourType = req.params.tourType;
    let lat1 = req.params.lat1;
    let lon1 = req.params.lon1;
    let lat2 = req.params.lat2;
    let lon2 = req.params.lon2;

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
    if (!lat1)
      return res.status(403).json({
        data: "",
        error: "please provide lat1",
      });
    if (!lon1)
      return res.status(403).json({
        data: "",
        error: "please provide log1",
      });
    if (!lat2)
      return res.status(403).json({
        data: "",
        error: "please provide log2",
      });
    if (!lon2)
      return res.status(403).json({
        data: "",
        error: "please provide log2",
      });

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

    await Promise.all(
      jetInfo.map(async (item, index) => {
        let distance = calculateDistance(lat1, lon1, lat2, lon2);
        let timeInHours = item.speed * distance;
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
  } catch (e) {
    res.status(500).json({
        error:"internal server error"
      });
  }
};

function calculateDistance(lat1, lon1, lat2, lon2) {
  Number.prototype.toRad = function () {
    return (this * Math.PI) / 180;
  };

  // var lat2 = 40.642334;
  // var lon2 = -73.78817;
  // var lat1 = 28.432177;
  // var lon1 = -81.308304;

  var R = 6371; // km
  //has a problem with the .toRad() method below.
  var x1 = lat2 - lat1;
  var dLat = x1.toRad();
  var x2 = lon2 - lon1;
  var dLon = x2.toRad();
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) *
      Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  console.log(d);
  return d;
}
