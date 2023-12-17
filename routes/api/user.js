const express = require("express");
const {
  current,
  addWater,
  // getAllStatistics,
} = require("../../controllers/userControllers");
const auth = require("../../middleware/midauth");

const router = express.Router();

router.get("/current", auth, current);
router.get("/update");
router.get("/goal");
router.post("/weight");
router.post("/food-intake");
router.put("/food-intake/:id");
router.delete("/food-intake/");
router.post("/water-intake", addWater);
router.delete("/water-intake");
// router.get("/statistics", getAllStatistics);

module.exports = router;
