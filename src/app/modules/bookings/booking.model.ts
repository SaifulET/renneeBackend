import { Schema, model } from "mongoose";

const BookingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    consultant: { type: Schema.Types.ObjectId, ref: "users", required: true },
    date: { type: Date, required: true },
    slot_time: { type: String, required: true }, // "HH:mm"
    meeting_type: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    transaction_id: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = model("Booking", BookingSchema);
