let { Airport } = require("../models/Airport");
let { Airport2 } = require("../models/Airport2");
const sendEmail  = require("../helpers")
const fs = require("fs")
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

  const numericValue1 = search.loc.lat;
  const numericValue2 = search.loc.lon;
  
  const numericValue3 = search1.loc.lat
  const numericValue4 = search1.loc.lon;

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
    if (!input)
      return res.status(400).send({ error: "please provide search query" });
    let search = [];
    if (input.length >= 3) {
      search = await Airport2.find({
       $text:{
         $search:`\"${input}\"` 
       },
     }).limit(5)

      // let nearBy = await Airport2.find({
      //   loc: {
      //     $near: {
      //       $geometry: {
      //         type: "Point",
      //         coordinates: [search[0].loc.lon, search[0].loc.lat],
      //       },
      //       // $minDistance: 1000,
      //       // $maxDistance: 5000
      //     },
      //   },
      // }).limit(5);

      // let mergedArray = search.concat(nearBy);

      // let newArray = Array.from(new Set(mergedArray.map(JSON.stringify))).map(
      //   JSON.parse
      // );
      // search = newArray;
    }

    res.send({ search });
  } catch (err) {
    console.log(err);
    res.send({ err: err });
  }
};

exports.update = async (req, res) => {
  try {
    await Airport2.updateMany({}, [
      {
        $set: {
          loc: {
            lon: "$longitudeAirport",

            lat: "$latitudeAirport",
          },
        },
      },
    ]);


    return res.send("done");
  } catch (err) {
    console.log(err);
  }
};



exports.sendEmail = async(req,res)=>{
  try{
    let data = req.body
    console.log(data)
    let requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "tourType",
      "from",
      "to",
      "craftType",
      "startDate",
      "person",
    ] 
    for (let key of requiredFields){
      if (!data[key] || data[key] == '' || data[key] == undefined || data[key] == null){
        return res.status(400).send({error:`please provide ${key}`})
      }
    }
    
    if (data.tourType == "roundTrip" && !data.endDate){
    return res.status(400).send({error:`please provide endDate`})
    }
    

      let templateContent = `
      <!DOCTYPE html>
<html>
<head>
    <title>Inquiry Confirmation</title>
    <style>
        /* ... existing styles ... */
        body {
            font-family: Arial, sans-serif;
            background-color: #0071BA;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            width: 80%;
            border-radius: 8px;
        }
        .header {
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 200px;
        }
        .two-column {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .column, .right-section {
            flex: 1;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin: 10px;
        }
        .full-width {
            width: 100%;
        }
        a {
            color: #0071BA;
        }
        table {
            background-color: #6EC1E4;
            border-radius: 8px;
            width: 100%;
        }
        th, td {
            padding: 10px;
        }
        h2, h3, h4 {
            color: #333;
        }
        /* ... additional or modified styles ... */
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <img src="https://jetlevel.com/wp-content/uploads/2023/07/jetLeval-logo.png" alt="JetLevel Logo">
    </div>

    <h2>Inquiry Confirmation</h2>
    <h3>JetLevel Aviation LLC</h3>
    
    <p>Hi ##USER_NAME##,</p>
    <p>Thank you for your inquiry! We will be in touch soon about the details of your trip. In the meantime, don't hesitate to contact us with any questions or requests.</p>
    <p>Best regards,</p>
    <p>JetLevel Aviation LLC</p>

  
    <div class="full-width">
        <h4>Itinerary (Local Time)</h4>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="color: white;">Dep. Date</th>
                    <th style="color: white;">Dep. Time</th>
                    <th style="color: white;">Aircraft</th>
                    <th style="color: white;">From</th>
                    <th style="color: white;">To</th>
                    <th style="color: white;">PAX</th>
                    ##DATE1##
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="color: white;">##DATE##</td>
                    <td style="color: white;">##TIME##</td>
                    <td style="color: white;">##AIRCRAFT_TYPE##</td>
                    <td style="color: white;">##FROM##</td>
                    <td style="color: white;">##TO##</td>
                    <td style="color: white;">##PAX##</td>
                    ##DATE2##
                </tr>
            </tbody>
        </table>
    </div>

    <div class="full-width" style="padding: 20px;">
        <h4>Contact Details</h4>
        <p>JetLevel Aviation LLC</p>
        <p>4325 North Landmark Dr</p>
        <p>Orlando FL 32817</p>
        <p>United States</p>
        <p>Phone: <a href="tel:8555385383">855-538 5383</a></p>
        <p>Mobile: <a href="tel:4077124863">407-712-4863</a></p>
        <p><a href="mailto:ricky@jetlevel.com">ricky@jetlevel.com</a></p>
        <p><a href="http://www.jetlevel.com" style="text-decoration: none; color: #0071BA;">www.jetlevel.com</a></p>
    </div>
</div>

</body>
</html>

      `
      let templateContent1 =`
      <!DOCTYPE html>
<html>
<head>
    <title>New Client Lead Request</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #0071BA;
            margin: 0;
            padding: 0;
        }
        .container {
            background-color: #ffffff;
            margin: 20px auto;
            padding: 20px;
            width: 80%;
            border-radius: 8px;
        }
        .header {
            background-color: black;
            color: #fff;
            text-align: center;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }
        .header img {
            max-width: 200px;
        }
        .two-column {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .column, .right-section {
            flex: 1;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin: 10px;
        }
        .full-width {
            width: 100%;
        }
        a {
            color: #0071BA;
        }
        table {
            background-color: #6EC1E4;
            border-radius: 8px;
            width: 100%; /* Adjusted width */
        }
        th, td {
            padding: 10px;
        }
        h2, h3, h4 {
            color: #333;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="header">
        <img src="https://jetlevel.com/wp-content/uploads/2023/07/jetLeval-logo.png" alt="JetLevel Logo">
    </div>

    <h2>Client Lead Request</h2>
    <p>Dear JetLevel Aviation LLC,</p>
    <p>You have just received a new flight request from the "Custom Booking Form" web app.</p>

    <div class="two-column">
        <div class="column">
            <h4>Aircraft Type(s) Interested</h4>
            <p>##AIRCRAFT_TYPE##</p>
            
            <h4>Contact</h4>
            <p>##CUSTOMER_NAME##</p>
            <p>##EMAIL##</p>
            <p>##PHONE##</p>
        </div>

      ##EXTRA_PART##
    </div>

    <div class="full-width">
        <h4>Itinerary</h4>
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
            <thead>
                <tr>
                    <th style="color: white;">Dep. Date</th>
                    <th style="color: white;">Dep. Time</th>
                    <th style="color: white;">From</th>
                    <th style="color: white;">To</th>
                    <th style="color: white;">PAX</th>
                    ##DATE1##
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style="color: white;">##DATE##</td>
                    <td style="color: white;">##TIME##</td>
                    <td style="color: white;">##FROM##</td>
                    <td style="color: white;">##TO##</td>
                    <td style="color: white;">##PAX##</td>
                    ##DATE2##
                </tr>
            </tbody>
        </table>
    </div>

    <div class="full-width" style="padding: 20px;">
        <h4>Your Contact Details As provided to your client</h4>
        <p>JetLevel Aviation LLC</p>
        <p>4325 North Landmark Dr</p>
        <p>Orlando FL 32817</p>
        <p>United States</p>
        <p>Phone: <a href="tel:8555385383">855-538 5383</a></p>
        <p>Mobile: <a href="tel:4077124863">407-712-4863</a></p>
        <p><a href="mailto:ricky@jetlevel.com">ricky@jetlevel.com</a></p>
        <p><a href="http://www.jetlevel.com" style="text-decoration: none; color: #0071BA;">www.jetlevel.com</a></p>
    </div>
</div>

</body>
</html>

      `
      templateContent = templateContent.replace("##USER_NAME##", data.firstName+" "+data.lastName);
      templateContent1 = templateContent1.replace("##CUSTOMER_NAME##", data.firstName+" "+data.lastName);
      templateContent = templateContent.replace("##DATE##", data.startDate.date);
      templateContent1 = templateContent1.replace("##DATE##", data.startDate.date);
      templateContent = templateContent.replace("##TIME##", data.startDate.time)
      templateContent1 = templateContent1.replace("##TIME##", data.startDate.time)
      templateContent = templateContent.replace("##FROM##", data.from);
      templateContent1 = templateContent1.replace("##FROM##", data.from);
      templateContent = templateContent.replace("##TO##", data.to)
      templateContent1 = templateContent1.replace("##TO##", data.to)
      templateContent = templateContent.replace("##PAX##", data.person)
      templateContent1 = templateContent1.replace("##PAX##", data.person)
      templateContent = templateContent.replace("##AIRCRAFT_TYPE##", data.craftType);
      templateContent1 = templateContent1.replace("##AIRCRAFT_TYPE##", data.craftType);
      templateContent1 = templateContent1.replace("##EMAIL##", data.email);
      templateContent1 = templateContent1.replace("##PHONE##", data.phone);
      if(data.tourType == "roundTrip"){
        templateContent = templateContent.replace("##DATE1##",`
        <th style="color: white;">Arr. Date</th>
        <th style="color: white;">Arr. Time</th>
        ` );
        templateContent1 = templateContent1.replace("##DATE1##",`
        <th style="color: white;">Arr. Date</th>
        <th style="color: white;">Arr. Time</th>
        ` );
        templateContent = templateContent.replace("##DATE2##",`
        <td style="color: white;">${data.endDate.date}</td>
        <td style="color: white;">${data.endDate.time}</td>
        ` );
        templateContent1 = templateContent1.replace("##DATE2##",`
        <td style="color: white;">${data.endDate.date}</td>
        <td style="color: white;">${data.endDate.time}</td>
        
        ` );
      }else{
        templateContent = templateContent.replace("##DATE1##","")
        templateContent = templateContent.replace("##DATE2##","")
        templateContent1 = templateContent1.replace("##DATE1##","")
        templateContent1 = templateContent1.replace("##DATE2##","")

      }



      //extra data
      if(data.isExtraData){
        templateContent1 = templateContent1.replace("##EXTRA_PART##", 
        `
        <div class="right-section">
        <h4>About the Client</h4>
        <p>${data.youself}</p>
        
        <h4>Traveling with pets:</h4>
        <p>${data.isPet?"Yes":"No"}</p>
        
        <h4>Travel with children under 3 years old:</h4>
        <p>${data.isChild?"Yes":"No"}</p>
        
        <h4>Baggage</h4>
        <ul>
            ${data.baggage.map(i=>(
              `<li>${i}</li>`
            ))}
        </ul>
        
        <h4>Message:</h4>
        <p>${data.requirement}</p>
    </div>
        `);    
      }else{
        templateContent1 = templateContent1.replace("##EXTRA_PART##", "")

      }
      let mailOptions = {
        from: process.env.EMAIL, //Sender Address
        to: data.email,
        subject: `Thank you for your inquiry`,
        html: templateContent,
      };
    
      await sendEmail(mailOptions)
        .then(async (response) => {
          console.log("email send:",response)

        }).catch(async (err) => {
          console.log(err)


          return res.status(400).send({
            response:{success: false},
            message: `Error in sending verification email, Please register again ${err}`,
          });
        });


        // let clientMails = ["fahd@jetlevel.com", "ricky@jetlevel.com", "kevin@jetlevel.com"]
        let clientMails = ["asadmuhammad427@gmail.com","aukhan@akru.co"]
          let mailOptions1 = {
            from: process.env.EMAIL, //Sender Address
            to: clientMails,
            subject: `Client Lead Request`,
            html: templateContent1,
          };
          await sendEmail(mailOptions1)
          .then(async (response) => {
            console.log("email send:",response)
  
          }).catch(async (err) => {
            console.log(err)
  
            return res.status(400).send({
              response:{success: false},
              message: `Error in sending verification email, Please register again ${err}`,
            });
          });
        
        
        return res.status(200).send({
          response:{success: true},
          message: "Email sent Successfully",
          redirectUri:"https://jetlevel.com/thank-you/"
        });
  }catch(err){
    console.log(err)


    return res.status(400).send({
      response:{success: false},
      message: `Oops, something went wrong - ${err}`,
    });
  }
}