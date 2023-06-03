// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
const { User, UserCredential } = require("../models/User");
const mongoose = require("mongoose");
const config = require('../config/environment');
// const sendEmail  = require("../helpers")
const userRegister = async (req, res) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  // try {
  //   try {
  //     //See if User Exists
  //     let user = await User.findOne({ email: req.body.email });
  //     if (user && user.is_email_verified) {
  //       return res
  //         .status(409)
  //         .send({ msg: "User already exists!", success: false });
  //     }

  //     const encryptedPassword = await bcrypt.hash(
  //       req.body.password,
  //       config.jwt.saltRounds
  //     );


  //     let encryptedToken = jwt.sign({
  //       email: req.body.email,
  //       fname: req.body.fname,
  //     }, config.jwt.jwtSecret,{ expiresIn: 60 * 60  }); // 1 hour

 

  //     delete req.body.password;

  //     if (user && !user.is_email_verified) {
  //       // if user exists but is not verified yet
  //       user.fname = req.body.fname;
  //       user.lname = req.body.lname;

  //       await user.save({ session });
  //       await UserCredential.findOneAndUpdate(
  //         { user: user._id },
  //         {
  //           password: encryptedPassword,
  //           sms_and_email_auth_token: encryptedToken,
  //         }
  //       ).session(session);
  //       return res.status(409).send({
  //         success: false,
  //         msg: "Already signup - please check you email address",
  //       });
  //     } else {
  //       // if user not exists
  //       // Create instance of user and save it to database
  //       let newUser = new User(req.body);
  //       let saveUser = await newUser.save({ session });

  //       let userCredentialsBody = {
  //         password: encryptedPassword,
  //         sms_and_email_auth_token: encryptedToken,
  //         user: saveUser._id,
  //       };

  //       // Create instance of user credentials and save it to database
  //       const newUserCredentials = new UserCredential(userCredentialsBody);
  //       newUserCredentials.save({ session });
  //     }

  //     const url = `http://localhost:8545/api/verifyEmail/${encryptedToken}`;
  //     const output = `Hi ${req.body.fname},
  //     <br/> Thanks for registering! <br/><br/> 
  //     Please <a href=${url}>Click Here</a> to verify your email address
  //      <br/><br/> If it was not you, please ignore this email`;
  //     let mailOptions = {
  //       from: process.env.EMAIL, //Sender Address
  //       to: req.body.email,
  //       subject: `Thank you for registering`,
  //       text: `Account Details for the new user Email ${req.body.email}`,
  //       html: output,
  //     };

  //     await sendEmail(mailOptions)
  //       .then(async (response) => {
  //         console.log("email send")
  //         await session.commitTransaction();
  //         session.endSession();

  //         return res.status(200).send({
  //           success: true,
  //           msg: "Email sent Successfully. To Login, Please verify your email",
  //         });
  //       })
  //       .catch(async (err) => {
  //         console.log(err)

  //         await session.abortTransaction();
  //         session.endSession();

  //         return res.status(400).send({
  //           success: false,
  //           msg: `Error in sending verification email, Please register again ${err}`,
  //         });
  //       });
  //   } catch (error) {
  //     console.log(error)

  //     await session.abortTransaction();
  //     session.endSession();

  //     return res.status(400).send({
  //       success: false,
  //       msg: `Ooops, something went wrong - Registration failed ${error.message}`,
  //     });
  //   }
  // } catch (error) {
  //   console.log(error)
  //   return res.status(500).send({
  //     success: false,
  //     msg: `Server Error - Registration failed ${error}`,
  //   });
  // }
};

const verifyEmail = async (req, res) => {
  // try {
  //   let code = req.params.token
  //   const userCredentials = await UserCredential.findOne(
  //     {
  //       sms_and_email_auth_token: code,
  //     },
  //     { user: 1 }
  //   );
  //   if (!userCredentials) {
  //     return res.status(400).send({
  //       msg: "Invalid Auth Code, verification failed",
  //       success: false,
  //     }); //msg:"User does not exist"
  //   }
  //   const user = await User.findById(userCredentials.user, {
  //     is_email_verified: 1,
  //   });

  //   if (user.is_email_verified) {
  //     return res.status(409).send({
  //       msg: "Email already verified",
  //       success: "false",
  //     });
  //   }
  //   if (user) {
  //     const session = await mongoose.startSession();
  //     try {
  //       // session started
  //       session.startTransaction();

  //       await User.findByIdAndUpdate(
  //         user._id,
  //         { is_email_verified: true },
  //         { new: false } // set it to true, if we wanna return updated value
  //       ).session(session);
  //       await UserCredential.findByIdAndUpdate(
  //         userCredentials._id,
  //         { sms_and_email_auth_token: "" },
  //         { new: false } // set it to true, if we wanna return updated value
  //       ).session(session);

  //       await session.commitTransaction();
  //       session.endSession();

  //       return res.status(200).send({
  //         status: 200,
  //         msg: "Email verified successful. Now you can login",
  //         success: true,
  //       });
  //     } catch (error) {
  //       await session.abortTransaction();
  //       session.endSession();

  //       return res.status(400).send({
  //         success: false,
  //         msg: "Ooops, something went wrong - Verification failed",
  //       });
  //     }
  //   }
  // } catch (error) {
  //   // console.log("Error", error);
  //   return res.status(500).send({
  //     success: false,
  //     msg: "Ooops, something went wrong - Verification failed",
  //   });
  // }
};

const userLogin = async (req, res) => {
  // const { email, password } = req.body;
  // try {
  //   //See if User Exists
  //   let user = await User.findOne({ email: req.body.email });
  //   if (!user) {
  //     return res
  //       .status(400)
  //       .send({ msg: `${email} is not a user`, success: false });
  //   }
  //   let UserCredentials = await UserCredential.findOne({ user: user._id });

  //   if (!user.is_email_verified) {
  //     return res.status(401).send({
  //       msg: "Email not verified, please check your email for verification",
  //       success: false,
  //     });
  //   }

  //   bcrypt.compare(
  //     password,
  //     UserCredentials.password,
  //     async (err, response) => {
  //       if (response) {
  //         return res.status(200).send({
  //           status: 200,
  //           msg: "Successfully logged in",
  //           data: {
  //             userDetails: user,
  //             token: jwt.sign(
  //               {
  //                 id: user._id,
  //                 email: user.email,
  //                 fname: user.fname,
  //               },
  //               config.jwt.jwtSecret,
  //               { expiresIn: 60 }
  //             ),
  //           },
  //         });
  //       } else {
  //         return res.status(401).send({
  //           msg: "Password is incorrect",
  //           success: false,
  //         });
  //       }
  //     }
  //   );
  // } catch (error) {
  //   return res.status(500).send({
  //     success: false,
  //     msg: error.message,
  //   });
  // }
};


module.exports = {
  userRegister,
  userLogin,
  verifyEmail,
};