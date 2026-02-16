import { Schema, model } from "mongoose";
import { ServiceModel, TService } from "./service.interface";

const ServiceSchema = new Schema<TService, ServiceModel>(
  {
    title: { type: String, required: true, index: true },
    description: { type: String, required: true, index: true },
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
    unavailable_dates: [{ type: Date }], // e.g., ["2025-10-25", "2025-10-26"]
    unavailable_slots_of_date: [
      {
        date: { type: Date, required: true },
        slots: [{ type: String }],
      },
    ], // e.g., [{ date: "2025-10-25", slots: ["10:00", "14:00"] }]
    custom_slots: [
      {
        start_time: { type: String, required: true }, // "HH:mm"
      },
    ],
    consultant_ids: [{ type: Schema.Types.ObjectId, ref: "users" }],
    isFeatured: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Service = model<TService, ServiceModel>("Service", ServiceSchema);





// {
//   "title": "Premium Consultation",
//   "description": "Expert advice session.",
//   "category_id": "6980ef0855841f60ccb9bc63",
//   "consultant_ids": ["6980ef0855841f60ccb9bc63"],
//   "price": 100,
//   "duration": 60,
//   "availability_type": "Both",
//   "custom_slots": [
//     { "start_time": "10:00" },
//     { "start_time": "14:00" }
//   ],
//   "weekends": ["Saturday", "Sunday"]
// }