const express = require("express");
const { register, login, logout, current } = require("../../controllers/auth");
const router = express.Router();
const jsonParser = express.json();
const auth = require("../../middleware/midauth");

router.post("/register", jsonParser, register);
router.post("/login", jsonParser, login);
router.post("/logout", auth, logout);
router.get("/current", auth, current);

module.exports = router;
