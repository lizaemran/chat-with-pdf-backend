require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const pdfParse = require("pdf-parse"); // for pdf
const xlsx = require("xlsx"); // for excel
const mammoth = require('mammoth'); //// for doc

const {Chat} = require("../models/Chat")
const {User} = require("../models/User")
// open ai config
const configuration = new Configuration({
  apiKey: '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',
});
// open ai instance
const openai = new OpenAIApi(configuration);


// Define route for chat
let chat = async (req, res) => {
  try {
    let message = req.body.message;
    // let _id = req.body._id;
 
    if (!message) {
      return res
        .status(400)
        .json({ message: "please provide a prompt", response: {} });
    }
    // let userDtails = await User.findOne({_id:req.user.id})
    // if(!userDtails) return res.status(404).json({message:"user not found. please signup to continue",response: {}})
    // if(new Date(Date.now()).toLocaleDateString() == new Date(userDtails.updatedAt).toLocaleDateString()){
    //   if(!userDtails.is_user_plus && userDtails.no_of_questions == 3){
    //     return res
    //     .status(400)
    //     .json({ message: "Daily limit reached", response: {} });
    //   }else{
    //     if(userDtails.is_user_plus && userDtails.no_of_questions == 1000){
    //       return res
    //       .status(400)
    //       .json({ message: "Daily limit reached", response: {} });
    //     }    
    //   }    
    // }else{
    //   userDtails.no_of_questions = 0
    // }
    // let chat  = await Chat.findOne({_id,userId:req.user.id})
    // if(!chat) {
    //   return res
    // .status(400)
    // .json({ message: "no chat found", response: {} });
    // }

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages:message,
    });

    // chat.messages = [{role: "user", content: message},response.data.choices[0].message]
    // await chat.save();
    // userDtails.no_of_questions += 1;
    // userDtails.updatedAt = Date.now();
    // await userDtails.save();
    console.log('response', response)
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

let openChat = async (req, res) => {
  try {
    let messages = req.body.messages;
 
    if (!messages) {
      return res
        .status(400)
        .json({ message: "please provide a prompt", response: {} });
    }
    
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages
    });
    
    
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
    let chat  = await Chat.find({userId:req.user.id}).sort({createdAt:-1})
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


let deleteChat = async (req, res) => {
  try{
    await Chat.remove({_id:req.body._id,userId:req.user.id})
    return res
    .status(200)
    .json({ message: "Successfully deleted",response: {}});
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
  console.log('key', process.env.OPENAI_API_KEY, 'req', req.files.file)
    try {
      // let userDtails = await User.findOne({_id:req.user.id})
      // if(!userDtails) return res.status(404).json({message:"user not found. please signup to continue",response: {}})
      // if(new Date(Date.now()).toLocaleDateString() == new Date(userDtails.updatedAt).toLocaleDateString()){
      //   if(!userDtails.is_user_plus && userDtails.no_of_files == 3){
      //     return res
      //     .status(400)
      //     .json({ message: "Daily limit reached", response: {} });
      //   }else{
      //     if(userDtails.is_user_plus && userDtails.no_of_files == 50){
      //       return res
      //       .status(400)
      //       .json({ message: "Daily limit reached", response: {} });
      //     }    
      //   }    
      // }else{
      //   userDtails.no_of_files = 0
      // }
      // Check if file was uploaded
      if (!req.files.file) {
        return res
          .status(400)
          .json({ message: "No file uploaded.", response: {} });
      }
      let arr = req.files.file.name.split(".");
      console.log(arr, 'arr')
      let data;
      if (arr[arr.length - 1] == "xlsx" || arr[arr.length - 1] == "xls") {
        console.log("in uploading...")
        // convert xls to json
        let wb = xlsx.read(req.files.file.data);
        let jsonData = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        data = JSON.stringify(jsonData);
       
      } else if (arr[arr.length - 1] == "pdf" || arr[arr.length - 1] == 'PDF') {
        // convert pdf to string
        console.log('converting into stringg...')
        data = await pdfParse(req.files.file);
        console.log('data', data)

        data = data.text;
      } else if (arr[arr.length - 1] == "doc" || arr[arr.length - 1] == "docx") {
        // Extract text from the document
        let result= await mammoth.extractRawText({buffer:req.files.file.data})
        data = result.value;
      }
      console.log('data processing', data)

      // Perform NLP using OpenAi API
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `Here is a text tell me about it ${data}` },
        ],
      });
    

      let allMessages = [
        { role: "user", content: `Here is a text tell me about it ${data}` },
        response.data.choices[0].message,
      ];

      // await Chat.create({
      //   userId: '123',
      //   title: req.files.file.name,
      //   messages: allMessages,
      //   createdAt:Date.now(),
      //   updatedAt:Date.now()
      // })
      // userDtails.no_of_files += 1;
      // userDtails.updatedAt = Date.now();
      // await userDtails.save();
      return res
        .status(200)
        .json({ message: "Success" ,response: response.data.choices[0].message});
    } catch (error) {
      console.error("Error in upload", error.response);
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
    openChat,
    getAllChats,
    deleteChat
  };


