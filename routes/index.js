const express = require("express");
const router = express.Router();
const { chat, upload,getAllChats } = require("../controllers/chat");
const { userRegister, userLogin, verifyEmail } = require("../controllers/user");
// const {isAuthenticated} = require("../middleware")

router.post("/userRegister", userRegister);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/userLogin", userLogin);

router.post("/upload", upload);
router.post("/chat",chat);
router.get("/getAllChats",getAllChats);


module.exports = router;