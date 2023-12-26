const express = require("express");
const {
  signup,
  signin,
  signout,
  forgotPassword,
} = require("../../controllers/auth");
const router = express.Router();
const jsonParser = express.json();
const auth = require("../../middleware/midauth");

router.post("/signup", jsonParser, signup);
router.post("/signin", jsonParser, signin);
router.post("/signout", auth, signout);
router.post("/forgot-password", jsonParser, forgotPassword);

module.exports = router;
