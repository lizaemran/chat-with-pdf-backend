require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const pdfParse = require("pdf-parse");
const xlsx = require("xlsx");
const Docxtemplater = require('docxtemplater');
const PizZip = require("pizzip");
const {Chat} = require("../models/Chat")
// const {User} = require("../models/User")
// open ai config
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
// open ai instance
const openai = new OpenAIApi(configuration);


// Define route for chat
let chat = async (req, res) => {
  try {
    let message = req.body.message;
 
    if (!message) {
      return res
        .status(400)
        .json({ message: "please provide a prompt", response: {} });
    }
    // let userDtails = await User.findOne({_id:req.user.id})
    // if(!userDtails) return res.status(404).json({message:"user not found. please signup to continue"})
    let chat = {}
    // chat  = await Chat.findOne({userId:req.user.id})
    // if(!chat) chat = new Chat({userId:req.user.id,title:"New chat"})

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:[...chat.messages,{role: "user", content: message}],
    });

    chat.messages = [...chat.messages,{role: "user", content: message},response.data.choices[0].message]
    await chat.save();
    
    return res
      .status(200)
      .json({ message: "Success", response: response.data.choices[0].message });
  } catch (error) {
    console.error("Error in chat", error);
    return res
      .status(500)
      .json({
        message: "Internal server error.",
        response: { error: error.message },
      });
  }
}
// Define route for fetch all chats

let getAllChats = async (req, res) => {
  try{
    let chat  = {}
    // await Chat.findOne({userId:req.user.id})
    return res
    .status(200)
    .json({ message: "Success", response: chat});
  }catch(err){
    console.error("Error in get all chat", err);
    return res
      .status(500)
      .json({
        message: "Internal server error.",
        response: { error: err.message },
      });
  }
}

// Define route for file upload
let upload = async (req, res) => {
    try {
      // let userDtails = await User.findOne({_id:req.user.id})
      // if(!userDtails) return res.status(404).json({message:"user not found. please signup to continue"})
      // Check if file was uploaded
      if (!req.files.file) {
        return res
          .status(400)
          .json({ message: "No file uploaded.", response: {} });
      }
      let arr = req.files.file.name.split(".");
      let data;
      if (arr[1] == "xlsx" || arr[1] == "xls") {
        // convert xls to json
        let wb = xlsx.read(req.files.file.data);
        let jsonData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        data = JSON.stringify(jsonData);
      } else if (arr[1] == "pdf") {
        // convert pdf to string
        data = await pdfParse(req.files.file);
        data = data.text;
      } else if (arr[1] == "doc" || arr[1] == "docx") {
        console.log("req.files.file.",req.files.file)
        const zip = new PizZip(req.files.file.data);

        const doc = new Docxtemplater(zip);
        
        // Render the document
        doc.render();

        // Extract text from the document
        const text = doc.getFullText();

        // Print the extracted text
        console.log(text);        
      }


      // Perform NLP using OpenAi API
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Here is a text tell me about it ${data}` },
        ],
      });

      let allMessages = [
        { role: "user", content: `Here is a text tell me about it ${data}` },
      ];
      allMessages.push(response.data.choices[0].message);
      // await Chat.create({
      //   userId: req.user.id,
      //   title:"New Chat",
      //   messages: allMessages
      // })
      return res
        .status(200)
        .json({ message: "Success", response: allMessages });
    } catch (error) {
      console.error("Error in upload", error);
      return res
        .status(500)
        .json({
          message: "Internal server error.",
          response: { error: error.message },
        });
    }
}

  module.exports = {
    upload,
    chat,
    getAllChats
  };


