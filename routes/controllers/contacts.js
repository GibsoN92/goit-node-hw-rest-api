const mongoose = require("mongoose");
const services = require("../../models/contacts");

const getAllContacts = async (req, res, next) => {
  try {
    const results = await services.listContacts();
    res.json({
      status: "Success",
      code: 200,
      message: "Successfully received contacts list!",
      data: {
        contacts: results,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Invalid contact ID format.",
      });
    }

    const result = await services.getContactById(contactId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        message: "Successfully found contact!",
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: "Contact doesn't exist.",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Invalid contact ID format.",
      });
    }

    const result = await services.removeContactById(contactId);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        message: "Successfully removed contact!",
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: "Contact doesn't exist.",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const result = await services.addContact(req.body);
    res.json({
      status: "Success",
      code: 200,
      message: "Successfully added contact!",
      data: {
        contact: result,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "Error",
        code: 404,
        message: "Missing fields in body!",
      });
    }

    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Invalid contact ID format.",
      });
    }

    const result = await services.updateContactById(contactId, req.body);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        message: "Successfully modified contact!",
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: "Contact doesn't exist.",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const switchFavorite = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "missing field favorite",
      });
    }

    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({
        status: "Error",
        code: 400,
        message: "Invalid contact ID format.",
      });
    }

    const result = await services.changeFavorite(contactId, req.body);
    if (result) {
      res.json({
        status: "Success",
        code: 200,
        message: `Contact marked as${result.favorite ? " " : " not "}favorite!`,
        data: {
          contact: result,
        },
      });
    } else {
      res.status(404).json({
        status: "Error",
        code: 404,
        message: "Contact doesn't exist.",
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = {
  getAllContacts,
  getContactById,
  deleteContact,
  createContact,
  updateContact,
  switchFavorite,
};
