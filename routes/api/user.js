const express = require("express");
const {
  current,
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
router.post("/water-intake");
router.delete("/water-intake");
// router.get("/statistics", getAllStatistics);

// router.get("/", auth, getAllContacts);
// router.get("/:contactId", auth, getOneContact);
// router.post("/", jsonParser, auth, newOneContact);
// router.delete("/:contactId", deleteContact);
// router.put("/:contactId", jsonParser, updateContact);
// router.patch("/:contactId/favorite", jsonParser, updateStatusContact);

module.exports = router;
