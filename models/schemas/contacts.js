const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema(
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
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  {
    versionKey: "version",
    timestamps: true,
  }
);

const Contact = mongoose.model("contact", contactSchema, "contacts");

module.exports = Contact;