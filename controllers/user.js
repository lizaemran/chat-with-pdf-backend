const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User, UserCredential } = require("../models/User");
const config = require('../config/environment');
const sendEmail  = require("../helpers")

const userRegister = async (req, res) => {
  try {
    try {
      //See if User Exists
      let user = await User.findOne({ email: req.body.email });
      if (user && user.is_email_verified) {
        return res
          .status(409)
          .send({ message: "User already Registered!", response :{success: false} });
      }

      const encryptedPassword = await bcrypt.hash(
        req.body.password,
        config.jwt.saltRounds
      );


      let encryptedToken = jwt.sign({
        email: req.body.email,
        fname: req.body.fname,
      }, config.jwt.jwtSecret,{ expiresIn: 60 * 60  }); // 1 hour

 

      delete req.body.password;

      if (user && !user.is_email_verified) {
        // if user exists but is not verified yet
        user.fname = req.body.fname;
        user.lname = req.body.lname;

        await user.save();
        let userCred = await UserCredential.findOne({ user: user._id })
          
        userCred.password = encryptedPassword;
        userCred.sms_and_email_auth_token = encryptedToken;
        await userCred.save()

      
      } else {
        // if user not exists
        // Create instance of user and save it to database
        let newUser = new User(req.body);
        let saveUser = await newUser.save();

        let userCredentialsBody = {
          password: encryptedPassword,
          sms_and_email_auth_token: encryptedToken,
          user: saveUser._id,
        };

        // Create instance of user credentials and save it to database
        const newUserCredentials = new UserCredential(userCredentialsBody);
        await newUserCredentials.save();
      }

      const url = `https://backend-chat-any-file.vercel.app/api/verifyEmail/${encryptedToken}`;
      const output = `Hi ${req.body.fname},
      <br/> Thanks for registering! <br/><br/> 
      Please <a href=${url}>Click Here</a> to verify your email address
       <br/><br/> If it was not you, please ignore this email`;
      let mailOptions = {
        from: process.env.EMAIL, //Sender Address
        to: req.body.email,
        subject: `Thank you for registering`,
        text: `Account Details for the new user Email ${req.body.email}`,
        html: output,
      };

      await sendEmail(mailOptions)
        .then(async (response) => {
          console.log("email send:",response)

          return res.status(200).send({
            response:{success: true},
            message: "Email sent Successfully. To Login, Please verify your email",
          });
        })
        .catch(async (err) => {
          console.log(err)


          return res.status(400).send({
            response:{success: false},
            message: `Error in sending verification email, Please register again ${err}`,
          });
        });
    } catch (error) {
      console.log(error)


      return res.status(400).send({
        response:{success: false},
        message: `Ooops, something went wrong - Registration failed ${error.message}`,
      });
    }
  } catch (error) {
    console.log(error)
    return res.status(500).send({
      success: false,
      msg: `Server Error - Registration failed ${error}`,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    let code = req.params.token
    const userCredentials = await UserCredential.findOne({
        sms_and_email_auth_token: code,
      });
    if (!userCredentials) {
      return res.status(400).send({
        message: "Invalid Auth Code, verification failed",
        response:{success: false},
      }); //msg:"User does not exist"
    }
    const user = await User.findById(userCredentials.user, {
      is_email_verified: 1,
    });

    if (user.is_email_verified) {
      return res.status(409).send({
        message: "Email already verified",
        response:{success: false},
      });
    }
    if (user) {
      try {

        await User.findByIdAndUpdate(
          user._id,
          { is_email_verified: true },
          { new: false } // set it to true, if we wanna return updated value
        );
        await UserCredential.findByIdAndUpdate(
          userCredentials._id,
          { sms_and_email_auth_token: "" },
          { new: false } // set it to true, if we wanna return updated value
        )


        return res.status(200).send({
          message: "Email verified successful. Now you can login",
          response:{success: true},
        });
      } catch (error) {

        return res.status(400).send({
          response:{success: false},
          message: "Ooops, something went wrong - Verification failed",
        });
      }
    }
  } catch (error) {
    // console.log("Error", error);
    return res.status(500).send({
      response:{success: false},
      message: "Ooops, something went wrong - Verification failed",
    });
  }
};



const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    //See if User Exists
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .send({ message: `${email} is not a user`,response:{ success: false} });
    }
    let UserCredentials = await UserCredential.findOne({ user: user._id });

    if (!user.is_email_verified) {
      return res.status(401).send({
        message: "Email not verified, please check your email for verification",
        response:{success: false},
      });
    }

    bcrypt.compare(
      password,
      UserCredentials.password,
      async (_, response) => {
        if (response) {
          return res.status(200).send({
            message: "Successfully logged in",
            response: {
              userDetails: user,
              token: jwt.sign(
                {
                  id: user._id,
                  email: user.email,
                  fname: user.fname,
                },
                config.jwt.jwtSecret,
                { expiresIn: 60 * 60  }
              ),
            },
          });
        } else {
          return res.status(401).send({
            message: "Password is incorrect",
            response:{success: false},
          });
        }
      }
    );
  } catch (error) {
    return res.status(500).send({
      response:{success: false},
      message: error.message,
    });
  }
};


module.exports = {
  userRegister,
  userLogin,
  verifyEmail,
};