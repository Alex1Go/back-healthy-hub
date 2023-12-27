const express = require("express");
const router = express.Router();
const jsonParser = express.json();
const auth = require("../../middleware/midauth");
const ctrl = require("../../controllers/auth");

router.post("/signup", jsonParser, ctrl.signup);
router.post("/signin", jsonParser, ctrl.signin);
router.post("/signout", auth, ctrl.signout);
router.post("/forgot-password", jsonParser, ctrl.forgotPassword);

module.exports = router;
