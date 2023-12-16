const express = require("express");
const {
  getAllContacts,
  getOneContact,
  newOneContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contactControllers");
const auth = require("../../middleware/midauth");

const router = express.Router();
const jsonParser = express.json();

router.get("/", auth, getAllContacts);
router.get("/:contactId", auth, getOneContact);
router.post("/", jsonParser, auth, newOneContact);
router.delete("/:contactId", deleteContact);
router.put("/:contactId", jsonParser, updateContact);
router.patch("/:contactId/favorite", jsonParser, updateStatusContact);

module.exports = router;
