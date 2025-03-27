import mongoose, { Schema } from "mongoose";
import options from "./index.js";

const notificationSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
      required: [true, "Notification must have a message"],
    },
    notifyType: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Notification must have a user"],
    },
    seen: {
      type: Boolean,
      default: false,
    },

  },
  options
);
const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
