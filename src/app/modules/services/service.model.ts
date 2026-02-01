import { Schema, model } from "mongoose";
import { ServiceModel, TService } from "./service.interface";

const ServiceSchema = new Schema<TService, ServiceModel>(
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
    unavailable_dates: [{ type: Date }],
    unavailable_slots_of_date: [
      {
        date: { type: Date, required: true },
        slots: [{ type: String }],
      },
    ],
    custom_slots: [
      {
        start_time: { type: String, required: true }, // "HH:mm"
      },
    ],
    consultant_ids: [{ type: Schema.Types.ObjectId, ref: "users" }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Service = model<TService, ServiceModel>("Service", ServiceSchema);
