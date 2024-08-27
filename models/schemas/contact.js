const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contact = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: { type: String, required: [true, "Set email for contact"] },
    phone: { type: String },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: "type",
    timestamps: true,
  }
);

const Contact = mongoose.model("contact", contact, "contacts");

module.exports = Contact;
