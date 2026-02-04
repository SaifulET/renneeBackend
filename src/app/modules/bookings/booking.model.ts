import { Schema, model } from "mongoose";
import { BookingModel, TBooking } from "./booking.interface";

const BookingSchema = new Schema<TBooking, BookingModel>(
  {
    user: { type: Schema.Types.ObjectId, ref: "users", required: true },
    service: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    consultant: { type: Schema.Types.ObjectId, ref: "users", required: true },
    discount: { type: Schema.Types.ObjectId, ref: "Discount" },
    user_details: {
      name: { type: String, },
      email: { type: String, },
      phone: { type: String, },
    },
    date: { type: Date, required: true },
    slot_time: { type: String, required: true }, // "HH:mm"
    meeting_type: {
      type: String,
      enum: {
        values: ["Online", "Offline", "Both"],
        message: "{VALUE} is not a valid meeting type. Allowed values are: Online, Offline, Both"
      },
      required: true,
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Cancelled"],
      default: "Pending",
    },
    transaction_id: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Booking = model<TBooking, BookingModel>("Booking", BookingSchema);
