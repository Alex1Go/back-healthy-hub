const express = require("express");
const ctrl = require("../../controllers/userControllers");
const auth = require("../../middleware/midauth");

const router = express.Router();

router.get("/current", auth, ctrl.current);
router.put("/update", auth, ctrl.update);
router.put("/goal", auth, ctrl.goalUpdate);
router.post("/weight", auth, ctrl.weightStatistic);
router.post("/food-intake", auth, ctrl.addFood);
router.put("/food-intake/:id");
router.delete("/food-intake/");
router.post("/water-intake", auth, ctrl.addWater);
router.delete("/water-intake", auth, ctrl.deleteWater);
router.get("/statistics", auth, ctrl.getAllStatistic);

router.get("/water", auth, ctrl.getWater);

module.exports = router;
