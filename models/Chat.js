const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  messages: {
    type: Array,
    default:[]
  },
  title:{
    type:String,
    default:""
  },
  createdAt: {
    type:Date,
    default:Date.now()
  },
  updatedAt: {
    type:Date,
    default:Date.now()
  },
});

let Chat = mongoose.model("chat", ChatSchema);
module.exports = { Chat };