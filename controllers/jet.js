const axios = require('axios');
exports.getAllJetInfo = async (req,res)=>{
    try{
    let from = req.params.from;
    let to = req.params.to;
    let tourType = req.params.tourType;
    if(!from) return  res.status(403).json({
        data:"",
        error:"please provide from"
    })
    if(!to) return  res.status(403).json({
        data:"",
        error:"please provide to"
    })
    if(!tourType) return res.status(403).json({
        data:"",
        error:"please provide tourType"
    })
    let speedArr =[304.142,347.59,391.039,434.488,456.213,456.213]
 
    let jetInfo = [
        {
            type:"Turbo prop",
            rate:4900,
            capacity:"6-8",
            speed:304.142,
            time:0,
            cost:0,
            img2:"https://jetlevel.com/wp-content/uploads/2023/08/Turbo_prop-int.jpeg",
            img1:"https://jetlevel.com/wp-content/uploads/2023/08/Turbo_prop_-etx.jpeg",
        },
        {
            type:"Very light jet",
            rate:5400,
            capacity:"4-5",
            speed:347.59,
            time:0,
            cost:0,
            img2:"https://jetlevel.com/wp-content/uploads/2023/08/very-light-jet-int.jpg",
            img1:"https://jetlevel.com/wp-content/uploads/2023/08/very-light-jet-ext.png"

        },
        {
            type:"Light jet",
            rate:6900,
            capacity:"6-8",
            speed:391.039,
            time:0,
            cost:0,
            img2:"https://jetlevel.com/wp-content/uploads/2023/08/Light_jet-int.jpeg",
            img1:"https://jetlevel.com/wp-content/uploads/2023/08/Light_jet-ext.jpeg"

        },
        {
            type:"Mid size jet",
            rate:7900,
            capacity:"7-9",
            speed:434.488,
            time:0,
            cost:0,
            img2:"https://jetlevel.com/wp-content/uploads/2023/08/Midsize_jet-int.jpeg",
            img1:"https://jetlevel.com/wp-content/uploads/2023/08/Midsize_jet-ext.jpeg"
        },
        {
            type:"Super midsize jet",
            rate:9000,
            capacity:"8-10",
            speed:456.213,
            time:0,
            cost:0,
            img2:"https://jetlevel.com/wp-content/uploads/2023/08/Super-midsize-int.jpeg",
            img1:"https://jetlevel.com/wp-content/uploads/2023/08/Super-midsize-ext.jpeg"


        },
        {
            type:"Heavy jet",
            rate:11000,
            capacity:"10-16",
            speed:456.213,
            time:0,
            cost:0,
            img2:"https://jetlevel.com/wp-content/uploads/2023/08/heavy-int.jpeg",
            img1:"https://jetlevel.com/wp-content/uploads/2023/08/heavy-ext.jpeg"

        },
    ]
    await Promise.all(speedArr.map(async(item,index)=>{
        
    
        const options = {
            method: 'GET',
            url: `https://greatcirclemapper.p.rapidapi.com/airports/route/${from}-${to}/${item}`,
            headers: {
                'content-type': 'text/html;charset=UTF-8',
                vary: 'Accept-Encoding',
                'X-RapidAPI-Key': 'b26b857bf3mshfcfa1bf903d5e8ap18811fjsnf79559acbe26',
                'X-RapidAPI-Host': 'greatcirclemapper.p.rapidapi.com'
            }
        };
        const response = await axios.request(options);
        
        console.log("-->",response.data.totals.flight_time_min);
        jetInfo[index].time = response.data.totals.flight_time_min/60
        if(tourType == "roundTrip"){
            jetInfo[index].cost = jetInfo[index].rate * jetInfo[index].time
            jetInfo[index].cost *= 2;

        }else if(tourType == "oneWay"){
            jetInfo[index].cost = jetInfo[index].rate * jetInfo[index].time
        }
    }))
    
        res.status(200).json({
            data:jetInfo
          
        })
    }catch(e){
    
    }
}