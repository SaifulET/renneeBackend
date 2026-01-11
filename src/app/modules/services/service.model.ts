import { Schema, model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category_id: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    imgs: [{ type: String }],
    availability_type: {
      type: String,
      enum: ["Online", "Offline", "Both"],
      required: true,
    },
    weekends: [{ type: String }], // e.g., ["Saturday", "Sunday"]
    custom_slots: [
      {
        start_time: { type: String, required: true }, // "HH:mm"
        end_time: { type: String, required: true }, // "HH:mm"
      },
    ],
    consultant_ids: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Service = model("Service", ServiceSchema);
