require("dotenv").config();

module.exports = {
  mongo: {
    debug: false,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    db_url: process.env.MONGODB_URI,
  },
  jwt: {
    jwtSecret: "mysecrettoken",
    saltRounds: 10,
  },
};
