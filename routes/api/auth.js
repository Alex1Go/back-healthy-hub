const express = require("express");
const { signup, signin, signout } = require("../../controllers/auth");
const router = express.Router();
const jsonParser = express.json();
const auth = require("../../middleware/midauth");

router.post("/signup", jsonParser, signup);
router.post("/signin", jsonParser, signin);
router.post("/signout", auth, signout);

router.post("/forgot-password");

module.exports = router;
