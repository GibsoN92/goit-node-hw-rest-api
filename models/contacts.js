const Contact = require("./schemas/contacts");

const listContactsService = (filter, skip, limit) => {
  return Contact.find(filter).skip(skip).limit(limit);
};

const getContactByIdService = (filter) => {
  return Contact.findById(filter);
};

const removeContactService = (filter) => {
  return Contact.deleteOne(filter);
};

const addContactService = (userId, { name, email, phone }) => {
  return Contact.create({ name, email, phone, owner: userId });
};

const updateContactService = (filter, updateData) => {
  return Contact.findByIdAndUpdate(filter, updateData, { new: true });
};

const updateStatusContactService = (filter, favorite) => {
  return Contact.findByIdAndUpdate(filter, { favorite }, { new: true });
};

module.exports = {
  listContactsService,
  getContactByIdService,
  removeContactService,
  addContactService,
  updateContactService,
  updateStatusContactService,
};
