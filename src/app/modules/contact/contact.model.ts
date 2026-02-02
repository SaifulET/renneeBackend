import { Schema, model, Model } from "mongoose";
import { ContactModel, TContact } from "./contact.interface";

const TcontactSchema = new Schema<TContact, ContactModel>(
  {
    name: { type: String, required: [true, "name is required"] },
    email: { type: String, required: [true, "email is required"] },
    title: { type: String, required: [true, "title is required"] },
    description: { type: String, required: [true, "description is required"] },
    isDelete: {
      type: Boolean,
      required: [false, "delete is not required"],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

TcontactSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

TcontactSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});

TcontactSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TcontactSchema.statics.isContactCustomId = async function (
  id: string
): Promise<TContact | null> {
  return this.findById(id);
};

const contacts = model<TContact, ContactModel>("contacts", TcontactSchema);

export default contacts;
