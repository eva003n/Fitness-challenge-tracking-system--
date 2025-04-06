import mongoose, { Schema } from "mongoose";
import options from "./index.js";
import Challenge from "./challenge.model.js";



//time series collection
const activitySchema = new Schema(
  {
    activity: {
      type: String,
      required: [true, "Activity is required"],
    },
    challengeId: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: [true, "Challenge id is required"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true

    },
    workout: {
      type: String,
      trim: true,
    },
    //default tracking metrics
    calories: {
      type: Number,
      default: 0

    },
    heartRate: {
      type: Number,
      default: 0

  
    },

    distanceCovered: {
      type: Number,
      default: 0

      
    },
    stepsCount: {
      type: Number,
      default: 0

    },

    reps: {
      type: Number,
      default: 0

    },
    //weight in kgs
    weightLifted: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["Completed", "In progress"],
      default: "In progress",
    },
    date:{
      type: Date,
      default: Date.now,
      required: [true, "Activity date field is required"]

    }
  },
  options
);

activitySchema.pre("save", function (next) {
  this.duration = Number(this.duration);

  next();
})
activitySchema.post("post", async function (next)  {
const ActivitiesByChallenge = await  

  next()
})

activitySchema.statics.calculateCompletion = async function(challengeId) {
  const activites = await Activity.find({challengeId})
  const totalActivities = activites.reduce((acc, activity) => acc + 1, 0);

  const totalCompleted = activites.reduce((acc, activity) => {
    if (activity.status === "completed") {
      return acc + 1;
    }
    return acc;
  }, 0);
  
  console.log(totalActivities, totalCompleted)
  const percentage = totalCompleted / totalActivities * 100
  const challenge = await Challenge.findById(challengeId)
  challenge.completion = percentage
  await challenge.save()
  return percentage
}
//add additional metrics based on workout type before save
// activitySchema.post("save", trackProgress)
const Activity = mongoose.model("Activity", activitySchema);



// Activity.watch().on("change", async function (doc) {
//  const challenge = await Challenge.findById(doc.challengeId);
//  const {goals} = challenge
//  const activities = await Activity.find({challengeId: doc.challengeId});

//  let totalStepsCount, totalDistanceCovered, totalCalories, totalHeartRate
//  goals.forEach(goal => {
// if(goal.metric === "stepsCount") {
// totalStepsCount = activities.reduce((acc, activity) => acc + activity.stepsCount, 0)
// }
  
//  });

// })


export default Activity;
