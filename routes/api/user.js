const express = require("express");
const {
  current,
  update,
  addWater,
  goalUpdate,
  // getAllStatistics,
} = require("../../controllers/userControllers");
const auth = require("../../middleware/midauth");

const router = express.Router();

router.get("/current", auth, current);
router.put("/update", auth, update);
router.put("/goal", auth, goalUpdate);
router.post("/weight");
router.post("/food-intake");
router.put("/food-intake/:id");
router.delete("/food-intake/");
router.post("/water-intake", auth, addWater);
router.delete("/water-intake");
// router.get("/statistics", getAllStatistics);

module.exports = router;
