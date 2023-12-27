const express = require("express");
const ctrl = require("../../controllers/recommendedControllers");
const auth = require("../../middleware/midauth");
const router = express.Router();

router.get("/recommended-food", auth, ctrl.getRecommendedFood);

module.exports = router;
