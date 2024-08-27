const Contact = require("./schemas/contact");

const listContacts = async () => {
  return Contact.find();
};

const getContactById = async (contactId) => {
  return Contact.findOne({ _id: contactId });
};

const removeContactById = async (contactId) => {
  return Contact.findByIdAndDelete({ _id: contactId });
};

const addContact = async (body) => {
  return Contact.create(body);
};

const updateContactById = async (contactId, body) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId },
    { $set: body },
    { new: true }
  );
};
const changeFavorite = async (contactId, body) => {
  return Contact.findByIdAndUpdate(
    { _id: contactId },
    { $set: body },
    { new: true }
  );
};

module.exports = {
  listContacts,
  getContactById,
  removeContactById,
  addContact,
  updateContactById,
  changeFavorite,
};
