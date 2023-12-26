const express = require("express");
const {
  current,
  update,
  addWater,
  deleteWater,
  goalUpdate,
  weightStatistic,
  getAllStatistic,
  addFood,
} = require("../../controllers/userControllers");
const auth = require("../../middleware/midauth");

const router = express.Router();

router.get("/current", auth, current);
router.put("/update", auth, update);
router.put("/goal", auth, goalUpdate);
router.post("/weight", auth, weightStatistic);
router.post("/food-intake", auth, addFood);
router.put("/food-intake/:id");
router.delete("/food-intake/");
router.post("/water-intake", auth, addWater);
router.delete("/water-intake", auth, deleteWater);
router.get("/statistics", auth, getAllStatistic);

module.exports = router;
