const Contact = require("../models/contacts");
const { schema } = require("../validation/contactValidationSchemas");

async function getAllContacts(req, res, next) {
  try {
    const contacts = await Contact.find({ owner: req.user.id }).exec();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
}
async function getOneContact(req, res, next) {
  try {
    const contact = await Contact.findById(req.params.contactId).exec();
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }

    res.status(200).json(contact);
  } catch (err) {
    next(err);
  }
}

async function newOneContact(req, res, next) {
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
    owner: req.user.id,
  };

  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing required name field" });
    }
    const result = await Contact.create(contact);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    if (result) {
      res.status(200).json({ message: "contact deleted" });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
}

async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const contact = {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    favorite: req.body.favorite,
  };
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing fields" });
    }
    const result = await Contact.findByIdAndUpdate(contactId, contact, {
      new: true,
    });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
}

async function updateStatusContact(req, res, next) {
  const { contactId } = req.params;
  try {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: "missing field favorite" });
    }
    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllContacts,
  getOneContact,
  newOneContact,
  deleteContact,
  updateContact,
  updateStatusContact,
};
