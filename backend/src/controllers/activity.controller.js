import asyncHandler from "../utils/asyncHandler.js";
import {
  activitySchema,
  paramsSchema,
  createActivitySchema,
  querySchema,
} from "../middlewares/validator.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import formatError from "../utils/format.js";
import Challenge from "../models/challenge.model.js";
import Activity from "../models/activity.model.js";
import { formatAndConvertObjectId } from "../utils/index.js";
import mongoose from "mongoose";



const createActivity = asyncHandler(async (req, res, next) => {
  const {
    challengeId,
    userId,
    workout,
    activity,
    date,
    stepsCount,
    heartRate,
    calories,
    distanceCovered,
  } = req.body;
//atomic operations
  const session = await mongoose.startSession();
  await session.startTransaction();

  //Validation 
  const { error } = createActivitySchema.validate({
    challengeId,
    userId,
    activity,
    workout,
    stepsCount,
    heartRate,
    calories,
    distanceCovered,
    date,
  });
  if (error)
    return next(ApiError.badRequest(400, formatError(error.message)));

  //Check if challange to track actually exixts
  const isExistingChallenge = await Challenge.findById(challengeId);
  if (!isExistingChallenge)
    return next(
      ApiError.notFound(404, "Challenge to track doesn't exists"),
      session
    );
  isExistingChallenge.status = "In progress";
  await isExistingChallenge.save();

  const createdActivity = await Activity.create({
    challengeId,
    userId,
    activity,
    workout,
    stepsCount,
    heartRate,
    calories,
    distanceCovered,
    date,
  });
 
  session.commitTransaction();
  session.endSession();

  const challenge = await Challenge.findById(challengeId);
  challenge.activities.push(createdActivity._id);
  await challenge.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdActivity, "Activity created successfully")
    );
});

const getAllActivities = asyncHandler(async (req, res, next) => {
  //check if activities actually exist
  const activities = await Activity.find();
  if (!activities && !activities.length) {
    return next(ApiError.notFound(404, "No activities created yet"));
  }

  const aggregateActivities = [
    // First, lookup the Challenge collection to add challenge data

    {
      $lookup: {
        from: "challenges",
        localField: "challengeId",
        foreignField: "_id",
        as: "Challenge",
        pipeline: [
          {
            $project: {
              // workOutType: 1,
              challengeName: 1,
              completion: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: "$Challenge",
    },
    {
      $project: {
        challengeName: "$Challenge.challengeName",
        completion: "$Challenge.completion",
        // workOutType: "$Challenge.workOutType",
        stepsCount: 1,
        heartRate: 1,
        calories: 1,
        distanceCovered: 1,
        reps: 1,
        weightLifted: 1,
        date: 1,
        createdAt: 1,
        activity: 1,
      },
    },
  ];

  const allActivities = await Activity.aggregate(aggregateActivities);
  if (!allActivities && !allActivities.length)
    return next(ApiError.notFound(404, "No activities created yet"));

  return res
    .status(200)
    .json(
      new ApiResponse(200, allActivities, "Activities fetched successfully")
    );
});

const getActivity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  
  const activity = await Activity.findById(id);
  if (!activity)
    return next(ApiError.notFound(404, "Activity doesn't exist or is deleted"));
  return res
    .status(200)
    .json(new ApiResponse(200, activity, "Activity fetched successfully"));
});

const getActivityBYChallenge = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //validation
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const aggregateActivity = [
    {
      $match: {
        challengeId: formatAndConvertObjectId(id),
      },
    },
    {
      $lookup: {
        from: "challenges",
        localField: "challengeId",
        foreignField: "_id",
        as: "Challenge",
        pipeline: [
          {
            $project: {
              workOutType: 1,
              challengeName: 1,
              startDate: 1,
              endDate: 1,
              completion: 1,
            },
          },
        ],
      },
    },

    {
      $unwind: "$Challenge",
    },

    {
      $addFields: {
        remainingDays: {
          $dateDiff: {
            startDate: "$$NOW",
            endDate: "$Challenge.endDate",
            unit: "day",
            timezone: "Africa/Nairobi",
          },
        },
      },
    },
    {
      $project: {
        activityId: "$_id",
        challengeName: "$challengeName",
        challengeId: "$challengeId",
        completion: "$Challenge.completion",
        stepsCount: 1,
        remainingDays: 1,
        heartRate: 1,
        calories: 1,
        distanceCovered: 1,
        reps: 1,
        weightLifted: 1,
        date: 1,
        status: 1,
        activity: 1,
        workout: 1,
      },
    },
  ];

  const activity = await Activity.aggregate(aggregateActivity);

  if (!activity && activity.length)
    return next(ApiError.notFound(404, "Activity doesn't exist or is deleted"));

  return res
    .status(200)
    .json(new ApiResponse(200, activity, "Activity fetched successfully"));
});

const updateActivity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    activity,
    workout,
    challengeId,
    stepsCount,
    distanceCovered,
    calories,
    heartRate,
    weightLifted,
    reps,
    status,
  } = req.body;
  const { error: paramsError } = paramsSchema.validate({ id });
  if (paramsError)
    return next(ApiError.badRequest(400, formatError(paramsError.message)));
  const { error } = activitySchema.validate({
    activity,
    workout,
    challengeId,
    distanceCovered,
    reps,
    status,
    calories,
    heartRate,
    weightLifted,
  });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const isExistiingActivity = await Activity.findById(id);
  if (!isExistiingActivity)
    return next(ApiError.notFound(404, "Activity doesn't exist or is deleted"));

  if (status === "Completed") {
    const challenge = await Challenge.findById(challengeId);
    challenge.completion = 100;
    await challenge.save();
  }
  const updatedActivity = await Activity.findOneAndUpdate(
    { _id: id },
    {
      challengeId,
      workout,
      activity,
      calories,
      distanceCovered,
      reps,
      heartRate,
      stepsCount,
      weightLifted,
      status,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatedActivity)
    return next(ApiError.internalServerError(500, "Something went wrong"));

  return res
    .status(201)
    .json(
      new ApiResponse(200, updatedActivity, "Activity updated successfully")
    );
});

const deleteActivity = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  //if Analytic is already deleted prevent documentNotFoundError by Mongoose
  const isExistingActivity = await Activity.findById(id);
  if (!isExistingActivity)
    return next(ApiError.notFound(404, "Activity doesn't exist or is deleted"));

  const deletedActivity = await Activity.deleteOne({ _id: id });

  if (!deletedActivity.deletedCount && !deletedActivity.acknowledged) {
    return next(
      ApiError.internalServerError(
        500,
        "Something went wrong while deleting activity, try again"
      )
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Activity deletion successful"));
});
const deleteAllActivities = asyncHandler(async (req, res, next) => {
  //if Analytic is already deleted prevent documentNotFoundError by Mongoose
  const isExistiingActivity = await Activity.find();
  if (!isExistiingActivity || !isExistiingActivity.length)
    return next(
      ApiError.notFound(404, "Activities doesn't exist or its deleted")
    );

  const deletedActivities = await Activity.deleteMany({});

  if (!deletedActivities.deletedCount && !deletedActivities.acknowledged) {
    return next(
      ApiError.internalServerError(500, "Something went wrong, try again")
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, null, "All activites deleted"));
});

//user reports for the current month and year
const activityProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  let {year, month } = req.query
  const {error:paramsError, value} = querySchema.validate({year, month})
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  if (paramsError) return next(ApiError.badRequest(400, formatError(error.message)));
//defaults to current year and month
  year = parseInt(year) || new Date().getFullYear()
  //default current month,  zero based index
  month = parseInt(month) || new Date().getMonth() + 1

  const aggregation = [

      {
        $match: {
          userId: formatAndConvertObjectId(id),
          $expr: {
            $and: [
              {
                $eq: [
                  {
                    $year: "$date"
                  },
                  year
                ]
              },
                
              {$eq: [
                  {
                    $month: "$date"
                  },
                  month
                ]
              }
            ]
          }
        }
      },
      {
        $addFields: {
          weekOfYear: {
            //ensure consistency with weeks that cross over month and locales, monday as start of week
            $isoWeek: "$date"
          },
          //creates a date object withe the first day of a particular month
          firstDayOfMonth: {
            $dateFromParts: {
              year: {
                $year: "$date"
              },
              month: {
                $month: "$date"
              },
              day: 1
            }
          },
    
        }
      },
      {
        $addFields: {
          
                 weekOfMonth: {
          $subtract: [
            "$weekOfYear",
            { $isoWeek: "$firstDayOfMonth" }
          ]
        }
        }
      },
    
      {
        $facet: {
          calories:[
            {
              $group:{
          _id: "$weekOfMonth",
                 totalCalories: {
                    $sum: "$calories"
                  },
                
              }
            },
         
            {
               $project: {
          week: "$_id",
          total:"$totalCalories",
                 _id: 0
            }
            },
            {
              $sort: {
                week: 1
              }
            },
           
          ],
          heartRate: [
            {
              $group: {
                 _id: "$weekOfMonth",
                 avgHeartRate: {
                    $avg: "$heartRate"
                  },
                
              }
            },
        
            {
              $project: {
          week: "$_id",
             total:"$avgHeartRate",
                 _id: 0
            }
              
            },
            {
              $sort: {
                week: 1
              }
            },
          ],
          distance: [
            {
              $group: {
                 _id: "$weekOfMonth",
                              totalDistance: {
                    $sum: "$distanceCovered"
                  },
                
              }
            },
           
            {
              $project: {
          week: "$_id",
          total:"$totalDistance",
                 _id: 0
            }
            },
            {
              $sort: {
                week: 1
              }
            },
          ],
          steps:[
            {
              $group: {
                 _id: "$weekOfMonth",
                totalSteps: {
                    $sum: "$stepsCount"
                  }
                
              }
            },
          
            {
              $project: {
          week: "$_id",
          total:"$totalSteps",
                 _id: 0
            }
            },
            {
              $sort: {
                week: 1
              }
            },
            
          ]
        }
      }
    
     
    
  ]
  

  const progress = await Activity.aggregate(aggregation);
  if(progress && !progress.length) return next(ApiError.notFound(404, "User progress not found"));

  return res
    .status(200)
    .json(new ApiResponse(200, progress, "Progress fetched successfully"));
});
const getUserAtivitySummary = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;

  const { error } = paramsSchema.validate({ user_id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const summaryAggregation = [
    {
      $match: {
        userId: formatAndConvertObjectId(user_id),
        $expr: {
          $and: [
            {
              $eq: [
                {
                  $year: "$date"
                },
                2025
              ]
            },
            {
              $eq: [
                {
                  $month: "$date"
                },
                3
              ]
            }
          ]
        }
      },
    },

    {
      $group: {
        //make mongodb group data by the date string and not the entire timestamp which would cause data collected the same date be treated as diff thus additional document
        _id: {
          $dateTrunc: {
            date: "$date",
            unit: "day",
          },
        },
        totalCalories: {
          $sum: "$calories",
        },
        avgHeartRate: {
          $avg: "$heartRate",
        },
        totalDistance: {
          $sum: "$distanceCovered",
        },
        totalSteps: {
          $sum: "$stepsCount",
        },
      },
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]

  const activitySummary = await Activity.aggregate(summaryAggregation);
 
  if (activitySummary && activitySummary.length === 0)
    return 
  // next(ApiError.notFound(404, "No activity summary exists"));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        activitySummary,
        "Activity summary fetched successfully"
      )
    );
});

// const changeStream = Activity.watch([
//   {
//     $match: {
//       operationType: {
//         $in: ["insert", "update", "delete"],
//       }
//     }
//   }
// ], {
//   fullDocument: "updateLookup",})

//   changeStream.on("change", async(data) => {
//     processChallengeProgress(data.fullDocument);
//   })
//   changeStream.once("error" , (e) => {
//     logger.error(e.message);
//   })

  const processChallengeProgress = async(data) => {
    const aggregation = [
      [
        {
                //filter all activities tat belong to a particular fitness challenge
                $match: {
                  challengeId: formatAndConvertObjectId(id),
                },
              },
              {
                $group: {
                  //group by challenge id and since the challenge id is the same for all documents it combine all the analytics to a single document
                  _id: "$challengeId",
                  //calculates the total activities that belong to a particular challenge
                  totalActivities: {
                    $sum: 1,
                  },
                  //conditionally count the no of activities marked as complete
                  totalCompleted: {
                    $sum: {
                      $cond: [
                        {
                          $eq: ["$status", "Completed"],
                        },
                        1,
                        0,
                      ],
                    },
                  },
                },
              },
              {
                $project: {
                  totalActivities: 1,
                  totalCompleted: 1, // sum of all activites completed
                  //the based on the toal activities and the total completed calculate the percentage
                  percentage: {
                    $cond: [
                      {
                        //befote calculating percentange ensure that the values are not equal to zero otherwise  continue 
                        $and: [
                          { $ne: ["$totalActivities", 0] },
                          { $ne: ["$totalCompleted", 0] },
                        ],
                      },
        // divison of the total activities completed and the total activies multiplies by 100
                      {
                        $multiply: [
                          {
                            $divide: ["$totalCompleted", "$totalActivities"],
                          },
                          100,
                        ],
                      },
                      //othwerwise return zero
                      0,
                    ],
                  },
                },
              }
        
        ],
    ]
    const progress = await Activity.aggregate(aggregation);
  }
export {
  createActivity,
  getAllActivities,
  getActivityBYChallenge,
  getActivity,
  deleteAllActivities,
  updateActivity,
  deleteActivity,
  activityProgress,
  getUserAtivitySummary,
};
