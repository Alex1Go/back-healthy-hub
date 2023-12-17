const express = require("express");
const {
  getRecommendedFood,
} = require("../../controllers/recommendedControllers");

const router = express.Router();

router.get("/recommended-food", getRecommendedFood);

module.exports = router;
