import mongoose, { Schema } from "mongoose";
import options from "./index.js";
import  aggregatePaginate from "mongoose-aggregate-paginate-v2";

const challengeSchema = new Schema(
  {
    challengeName: {
      type: String,
      trim: true,
      minlength: [3, "Challenge title must be at least 3 characters long"],
      default: "",
    },
    description: {
      type: String,
      trim: true,
      minlength: [5, "Challenge decription must be at least 5 characters long"],
    },
    workOutType: {
      type: String,
      trim: true,
      minlength: [3, "Workout type must be at least 3 charactes long"],
      required: [true, "Workout type is required"],
    },
    image: {
      imageId: {
        type: String,
        default: "fit-track-images/file_creig5",
      },
      imageUrl: {
        type: String,
        default: "https://res.cloudinary.com/dz15elupq/image/upload/v1739885575/fit-track-images/file_creig5.jpg",
      },
    },
    //schedule for each challenge
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      required: [true, "user id is required"]
    },
    startDate: {
      type: Date,
      trim: true,
      required: [true, "Challenge start date is required"],
      default: Date.now,
    },
    endDate: {
      type: Date,
      trim: true,
      required: [true, "Challenge end date is required"],
      default: Date.now,
    },
    status: {
      type: String,
      enum: [ "Completed", "In progress"],
      default: "In progress",
    },
    instructions: {
      type: String,
      trim: true,
      default: "",
    },
    
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    //completon percentage
    completion: {
      type: Number,
      default: 0,
    },
    activities: {
      type: [Schema.Types.ObjectId],
      ref: "Activity",
    },
    access: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
    
  },
  options
);
challengeSchema.pre("save", async function (next) {
  if (!this.startDate) this.startDate = Date.now();
 
  next();
});

//mongoose paginate plugin
challengeSchema.plugin(aggregatePaginate);

const Challenge = mongoose.model("Challenge", challengeSchema);


export default Challenge;
