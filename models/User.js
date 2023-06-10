const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  is_email_verified: {
    type: Boolean,
    default: false,
  },
  is_user_plus :{
    type: Boolean,
    default: false,
  },
  plus_expiry:{
    type:Number,
  },
  createdAt: {
    type:Number,
    default:Date.now()
  },
  updatedAt: {
    type:Number,
    default:Date.now()
  },

});

const UserCredentialsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  sms_and_email_auth_token: {
    
    type: String,
    // default: "sms_and_email_auth_token",
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type:Number,
    default:Date.now()
  },
  updatedAt: {
    type:Number,
    default:Date.now()
  },
});

let User = mongoose.model("user", UserSchema);
let UserCredential = mongoose.model("user_credential", UserCredentialsSchema);
module.exports = { User, UserCredential };