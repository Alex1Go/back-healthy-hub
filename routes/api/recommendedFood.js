const express = require("express");
const auth = require("../../middleware/midauth");
const {
  getRecommendedFood,
} = require("../../controllers/recommendedControllers");
const router = express.Router();

router.get("/recommended-food", auth, getRecommendedFood);

module.exports = router;
