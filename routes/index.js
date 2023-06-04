const express = require("express");
const router = express.Router();
const { chat,openChat, upload,getAllChats } = require("../controllers/chat");
const { userRegister, userLogin, verifyEmail } = require("../controllers/user");
const {isAuthenticated} = require("../middleware")

router.post("/userRegister", userRegister);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/userLogin", userLogin);

router.post("/upload", isAuthenticated,upload);
router.post("/chat", isAuthenticated,chat);
router.post("/openChat",openChat);
router.get("/getAllChats", isAuthenticated,getAllChats);




module.exports = router;