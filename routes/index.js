const express = require("express");
const router = express.Router();
const { chat,openChat, deleteChat,upload,getAllChats } = require("../controllers/chat");
const { userRegister, userLogin, verifyEmail ,isUserPlus} = require("../controllers/user");
const { getAllJetInfo,search,update,sendEmail} = require("../controllers/jet");
const {isAuthenticated} = require("../middleware");
const { payments } = require("../controllers/payment");

router.post("/userRegister", userRegister);
router.get("/verifyEmail/:token", verifyEmail);
router.post("/userLogin", userLogin);
router.get("/isUserPlus", isAuthenticated,isUserPlus);

router.post("/upload", isAuthenticated,upload);
router.post("/chat", isAuthenticated,chat);
router.post("/openChat",openChat);
router.get("/getAllChats", isAuthenticated,getAllChats);
router.post("/deleteChat", isAuthenticated,deleteChat);

router.post("/payments", isAuthenticated,payments);



router.get("/getAllJetInfo/:fromLocation?/:to?/:tourType?",getAllJetInfo);


router.get("/search",search)
router.get("/update",update)
router.post("/sendEmail",sendEmail)

module.exports = router;