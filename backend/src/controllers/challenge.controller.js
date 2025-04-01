import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  challengeSchema,
  paginateSchema,
  paramsSchema,
  querySchema,
} from "../middlewares/validator.js";
import ApiResponse from "../utils/ApiResponse.js";
import formatError from "../utils/format.js";
import Challenge from "../models/challenge.model.js";
import { uploadToCloudinary } from "./user.controller.js";
import mongoose from "mongoose";
import { formatAndConvertObjectId, getDateDifference } from "../utils/index.js";
import Activity from "../models/activity.model.js";
import User from "../models/user.model.js";
import logger from "../logger/logger.winston.js";
import { createNotification } from "./notification.controller.js";

//pagination options

//get all the challenges based on user
const getPublicChallenges = asyncHandler(async (req, res, next) => {
  let { page, limit } = req.query;
  

  const { error } = paginateSchema.validate({ page, limit });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  //convert to number and assign default values if not provided
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;


  const options = {
    page,
    limit,
    lean: true,
  };

  const aggregate = Challenge.aggregate([
    {
      $match: {
        access: "Public"
      }
    },
    {
      $sort: { createdAt: -1 },//latest created
    },
    {
      $project: {
        _id: 1,
        challengeName: 1,
        image: 1,
        description: 1,
        startDate:1,
        endDate: 1,
        workOutType: 1,
        access: 1,
        createdAt: 1,
        instructions: 1,
        status: 1,
     
      },
    }
  ])
  //get all challanges based on latest created
  const results = await Challenge.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        challenges: results.docs,
        pagination: {
          total: results.totalDocs,
          totalPages: results.totalPages,
          currentPage: results.currentPage,
          hasNextPage: results.hasNextPage,
          hasPrevPage: results.hasPrevPage,
          nextPage: results.nextPage,
          prevPage: results.prevPage,
        },
      },
      "Challenges fetched successfully"
    )
  );
});
const getChallenges = asyncHandler(async (req, res, next) => {
  let { page, limit } = req.query;
  

  const { error } = paginateSchema.validate({ page, limit });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  //convert to number and assign default values if not provided
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;


  const options = {
    page,
    limit,
    lean: true,
  };

  const aggregate = Challenge.aggregate([
    {
      $match: {}
    },
    {
      $sort: { createdAt: -1 },//latest created
    },
    {
      $project: {
        _id: 1,
        challengeName: 1,
        image: 1,
        description: 1,
        startDate:1,
        endDate: 1,
        workOutType: 1,
        access: 1,
        createdAt: 1,
        instructions: 1,
        status: 1,
     
      },
    }
  ])
  //get all challanges based on latest created
  const results = await Challenge.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        challenges: results.docs,
        pagination: {
          total: results.totalDocs,
          totalPages: results.totalPages,
          currentPage: results.currentPage,
          hasNextPage: results.hasNextPage,
          hasPrevPage: results.hasPrevPage,
          nextPage: results.nextPage,
          prevPage: results.prevPage,
        },
      },
      "Challenges fetched successfully"
    )
  );
});

const getAllUserChallenges = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  //validation
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const isChallenge = await Challenge.find({ createdBy: id });
  //all the challenges that belong to currently logged in user

  if (!isChallenge)
    return next(ApiError.notFound(404, "Challenges don't exists"));

  const userChallengesAggregation = [
    {
      $match: {
        //users id
        createdBy: formatAndConvertObjectId(id),
      },
    },

    {
      //add specified fields to the resulting documents
      $addFields: {
        challenge_id: "$_id",
        //integer rep of the month 1-12
        month: {
          $month: "$startDate",
        },
        //integer rep of the day starting sunday
        dayOfWeek: {
          $dayOfWeek: "$startDate",
        },
        //actual date of th month
        monthDate: {
          $dayOfMonth: {
            date: "$startDate",
            timezone: "Africa/Nairobi",
          },
        },
        year: {
          $year: {
            date: "$startDate",
            timezone: "Africa/Nairobi",
          },
        },

        duration: {
          days: {
            $dateDiff: {
              startDate: "$startDate",
              endDate: "$endDate",
              unit: "day",
            },
          },
          remainingDays: {
            $divide: [
              {
                $subtract: ["$endDate", "$$NOW"],
              },
              1000 * 60 * 60 * 24, //1 day
            ],
          },
          // hours: {
          //   $dateDiff: {
          //     startDate: "$startDate",
          //     endDate: "$endDate",
          //     unit: "hour",
          //   },
          // },
          // minutes: {
          //   $dateDiff: {
          //     startDate: "$startDate",
          //     endDate: "$endDate",
          //     unit: "minute",
          //   },
          // },
        },
      },
    },

    {
      $group: {
        _id: "$workOutType",
        Challenges: {
          //$$RO0T means group entire documents
          $push: "$$ROOT",
        },
      },
    },
    {
      $unwind: "$Challenges",
    },
    {
      $project: {
        workout: "$_id",
        Challenges: 1,
        _id: 0,
      },
    },
    //remove unwanted fields
    {
      $project: {
        "Challenges._id": 0,
      },
    },
    //sort challenges by due date in ascending order thus when a challenge is almost due its preceeds others
    {
      $sort: {
        "Challenges.month": 1,
        "Challenges.duration.remainingDays": 1,
      },
    },
  ];

  const userChallenges = await Challenge.aggregate(userChallengesAggregation);

  return res
    .status(200)
    .json(
      new ApiResponse(200, userChallenges, "Challenges fetched successfully")
    );
});

//Handle getting a single challenge by id
const getChallenge = asyncHandler(async (req, res, next) => {
  // this is the id of the individual challenge
  const { id } = req.params;
  //Validation
  const { error } = paramsSchema.validate({ id });
  //Validation error
  if (error) {
    return next(ApiError.badRequest(400, formatError(error.message)));
  }

  //if a challenge doesnt exists send error response
  const challenge = await Challenge.findById(id);

  if (!challenge)
    return next(ApiError.notFound(404, "Challenge doesn't exists"));

  const aggregateChallenge = [
    //filter and get specific challenge data
    {
      $match: {
        _id: formatAndConvertObjectId(id),
      },
    },
    {
      $addFields: {
        duration: {
          start: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$startDate",
            },
          },
          end: {
            $dateToString: {
              format: "%d-%m-%Y",
              date: "$endDate",
            },
          },
          days: {
            $dateDiff: {
              startDate: "$startDate",
              endDate: "$endDate",
              unit: "day",
              timezone: "Africa/Nairobi",
            },
          },
          hours: {
            $dateDiff: {
              startDate: "$startDate",
              endDate: "$endDate",
              unit: "day",
              timezone: "Africa/Nairobi",
            },
          },
          minutes: {
            $dateDiff: {
              startDate: "$startDate",
              endDate: "$endDate",
              unit: "minute",
              timezone: "Africa/Nairobi",
            },
          },
        },

        remaining: {
          days: {
            $dateDiff: {
              startDate: "$$NOW",
              endDate: "$endDate",
              unit: "day",
              timezone: "Africa/Nairobi",
            },
          },
          hours: {
            $dateDiff: {
              startDate: "$$NOW",
              endDate: "$endDate",
              unit: "hour",
              timezone: "Africa/Nairobi",
            },
          },
          minutes: {
            $dateDiff: {
              startDate: "$$NOW",
              endDate: "$endDate",
              unit: "minute",
              timezone: "Africa/Nairobi",
            },
          },
          seconds: {
            $dateDiff: {
              startDate: "$$NOW",
              endDate: "$endDate",
              unit: "second",
              timezone: "Africa/Nairobi",
            },
          },
        },
      },
    },
  ];

  return res
    .status(200)
    .json(new ApiResponse(200, challenge, "Challenge fetched successfully"));
});

//Handle challlange creation
const createChallenge = asyncHandler(async (req, res, next) => {
  const {
    challengeName,
    createdBy,
    description,
    workOutType,
    startDate,
    difficulty,
    endDate,
    access,
    instructions
  } = req.body;

  //Validate hhat the data mests the defined requirements
  const { error } = challengeSchema.validate({
    challengeName,
    createdBy,
    description,
    workOutType,
    startDate,
    difficulty,
    endDate,
    access,
    instructions
  });
  //if the data doesn't meest requirements
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const isExistingChallenge = await Challenge.findOne({ challengeName });
  if (isExistingChallenge)
    return next(ApiError.conflictRequest(409, "Challange already exists"));

  let challengeImage = "";
  if (req.file && Object.keys(req.file).length) {
    challengeImage = await uploadToCloudinary(req.file.buffer);
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  if (req.file && !challengeImage)
    return next(
      ApiError.internalServerError(500, "Image upload failed"),
      session
    );
  //create challenge for the specified user
  const createdChallenge = await Challenge.create({
    challengeName,
    description,
    workOutType,
    createdBy,
    startDate,
    difficulty,
    endDate,
    image: {
      imageUrl: challengeImage.secure_url,
      imageId: challengeImage.public_id,
    },
    access,
    instructions
  });
  //if the challenge creation does not return created  document
  if (!createdChallenge) {
    await session.abortTransaction();
    await session.endSession();
    return next(ApiError.internalServerError());
  }

  await session.commitTransaction();
  await session.endSession();
  return res
    .status(201)
    .json(
      new ApiResponse(201, createdChallenge, "Challenfe created successfully")
    );
});

//updating challenge data
const updateChallenge = asyncHandler(async (req, res, next) => {
  //id of challenge to update
  const { id } = req.params;
  const {
    challengeName,
    description,
    workOutType,
    difficulty,
    startDate,
    endDate,
    status,
    instructions,
    createdBy,
    access,
  } = req.body;

  //Validation
  const { error: paramsError } = paramsSchema.validate({ id });
  if (paramsError) return next(ApiError(404, paramsError.message));

  const { error } = challengeSchema.validate({
    challengeName,
    description,
    workOutType,
    startDate,
    difficulty,
    endDate,
    status,
    instructions,
    createdBy,
    access,
  });
  //if the data doesn't meest requirements
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const isExistingChallange = await Challenge.findById(id);
  if (!isExistingChallange)
    return next(ApiError.notFound(404, "Challange doesn't exist"));

  let challengeImage = "";
  if (req.file && Object.keys(req.file).length) {
    challengeImage = await uploadToCloudinary(req.file.buffer);
    isExistingChallange.image.imageUrl = challengeImage.secure_url;
    isExistingChallange.image.imageId = challengeImage.public_id;
    await isExistingChallange.save();
  }
  if (status === "In progress" && isExistingChallange.completion === 100) {
    isExistingChallange.completion = 0;
    await isExistingChallange.save();
  }
  //first check if the person requesting the challenge update check is the creator of the challenge
  // if (isExistingChallenge.createdBy !== req.user._id)
  //   return next(
  //     ApiError.unauthorized(
  //       401,
  //       "You are not authorized to update this challenge"
  //     )
  //   );

  const updatedChallenge = await Challenge.findOneAndUpdate(
    { _id: id },
    {
      challengeName,
      description,
      workOutType,
      startDate,
      endDate,
      status,
      createdBy,
      access,
      instructions,
      difficulty,
    },
    //options
    {
      new: true, //ensures that an updarted challenge is returned
      runValidators: true, //rund a shallow validation
    }
  );

  if (!updatedChallenge)
    return next(
      ApiError.internalServerError(
        500,
        "Something went wrong while updating challenge, try again"
      )
    );
  return res
    .status(201)
    .json(
      new ApiResponse(201, updatedChallenge, "Challenge updated successfully")
    );
});

//search challenges by name and workout type
const searchForChallenges = asyncHandler(async (req, res, next) => {
  //To do

  return res.send("Searching for challenges ...");
});

//calculate challenge progress

//Handle challenge deletion
const deleteChallenge = asyncHandler(async (req, res, next) => {
  //challenge ifd
  const { id } = req.params;

  //start a mongoose transaction
  const session = await mongoose.startSession();
  await session.startTransaction();
  //Validation
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  //avoid documentnotfounderror
  const isExistingChallenge = await Challenge.findById(id);
  if (!isExistingChallenge)
    return next(ApiError.notFound(404, "Challange doesn't exists"));

  //first check if the person requesting the challenge deletion is the creator of the challenge
  // if (String(isExistingChallenge.createdBy) !== String(req.user._id) || req.user.role !== "admin")
  //   return next(
  //     ApiError.unAuthorizedRequest(
  //       401,
  //       "Cannot delete this challenge"
  //     )
  //   );

  const deletedChallenge = await Challenge.deleteOne({ _id: id });
  if (!deletedChallenge.deletedCount && !deletedChallenge.acknowledged) {
    return next(
      ApiError.internalServerError(500, "Could not delete challange"),
      session
    );
  }
  await session.commitTransaction();
  await session.endSession();
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Challenge deletion successful"));
});

//monitors and tracks  a users progress in a particular challenge, their logs  and determine the challenge progress
const challengeProgress = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const aggregation = [
    //filter all the docs that match a particular challenge id
    {
      $match: {
        _id: formatAndConvertObjectId(id),
      },
    },
    //get all activities that belong to a particular challenge but fitsrts we need access to a id to perfom looku[ so unwind the array to create a doc for each challenge id
    {
      $unwind: "$activities",
    },

    {
      $lookup: {
        from: "activities",
        localField: "activities",
        foreignField: "_id",
        as: "workout",
      },
    },
    //returns an array with all activites as documens thus unwind to aggregate each activity
    {
      $unwind: "$workout",
    },
    {
      $group: {
        _id: null,
        totalActivities: {
          $sum: 1,
        },
        totalcompleted: {
          $sum: {
            $cond: [
              {
                $eq: ["$workout.status", "Completed"],
              },
              1,
              0,
            ],
          },
        },
        //add each unique activity to an array returns an array of documents
        workouts: {
          $addToSet: "$workout",
        },
        //we need challenge info so use $$ROOT to include all earlier documents
        challenge: {
          /*but this creates duplicates of the challenge doc so use "first" accumulator to get the first doc*/
          $first: "$$ROOT",
        },
      },
    },
    //calculate the percentage completion
    {
      $project: {
        percentage: {
          $multiply: [
            {
              $cond: [
                {
                  //ensure that the values to divide are not equal to zero to avoid division by zero
                  $and: [
                    {
                      $ne: ["totalActivities", 0],
                      $ne: ["totalcompleted", 0],
                    },
                  ],
                },

                {
                  $divide: ["$totalcompleted", "$totalActivities"],
                },
                0,
              ],
            },
            100,
          ],
        },
        workouts: "$workouts",
        challenge: "$challenge",
        totalActivities: "$totalActivities",
        totalCompleted: "$totalcompleted",
        _id: 0,
      },
    },
  ];

  const progress = await Challenge.aggregate(aggregation);
  if (progress && !progress.length)
    return 
// next(ApiError.notFound(404, "Challenge progress not found"));
  const challenge = await Challenge.findById(id);

  challenge.completion = progress[0] && progress[0].percentage;
  if (progress[0] && progress[0].percentage === 100) {
    challenge.status = "Completed";
  }
  await challenge.save();
  console.log(challenge);

  return res
    .status(200)
    .json(new ApiResponse(200, progress[0], "Progress fetched successfully"));
});

const userAnalytics = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  //Validate params
  const { error } = paramsSchema.validate({ user_id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  //check if user exists if not send a 404 not found error and block futher progress
  const isUser = await User.findById(user_id);
  if (!isUser) return next(ApiError.notFound(404, "User doesn't exist"));

  const analyticsAggregation = [
    {
      $match: {
        createdBy: formatAndConvertObjectId(user_id),
      },
    },
    //facet allowa as to execute multiple aggregations on the same input documents
    {
      $facet: {
        workoutSummary: [
          {
            $group: {
              _id: "$workOutType",
              count: {
                $sum: 1,
              },
            },
          },
          {
            $group: {
              _id: null,
              challenges: {
                $sum: 1,
              },
              completed: {
                $sum: {
                  $cond: [
                    {
                      $eq: ["$completion", 100],
                    },
                    1,
                    0,
                  ],
                },
              },
              workouts: {
                $push: {
                  type: "$_id",
                  count: "$count",
                },
              },
            },
          },
          {
            $unwind: "$workouts",
          },
          {
            $project: {
              type: "$workouts.type",

              _id: 0,
              percentagePerWorkout: {
                $multiply: [
                  {
                    $divide: ["$workouts.count", "$challenges"],
                  },
                  100,
                ],
              },
            },
          },
        ],
        challengeSummary: [
          {
            $unwind: {
              path: "$activities",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "activities",
              localField: "activities",
              foreignField: "_id",
              as: "workouts",
            },
          },
          {
            $unwind: {
              path: "$workouts",
              preserveNullAndEmptyArrays: true,
            },
          },

          {
            $group: {
              _id: null,

              currentChallenges: {
                $addToSet: {
                  _id: "$_id",
                  name: "$challengeName",
                  completion: "$completion",
                  startDate: "$startDate",
                  endDate: "$endDate",
                  status: "$status",
                },
              },
              totalCalories: {
                $sum: "$workouts.calories",
              },
              avgHeartRate: {
                $avg: "$workouts.heartRate",
              },
              totalDistance: {
                $sum: "$workouts.distanceCovered",
              },
              totalSteps: {
                $sum: "$workouts.stepsCount",
              },
            },
          },
          {
            $project: {
              _id: 0,
              currentChallenges: {
                $sortArray: {
                  input: {
                    $filter: {
                      input: "$currentChallenges",
                      as: "challenge",
                      cond: {
                        $and: [
                          {
                            $eq: ["$$challenge.status", "In progress"],
                          },
                          {
                            $lt: ["$$challenge.completion", 100],
                          },
                        ],
                      },
                      limit: 2,
                    },
                  },
                  sortBy: {
                    endDate: 1,
                  },
                },
              },
              metrics: {
                calories: "$totalCalories",
                steps: "$totalSteps",
                distance: "$totalDistance",
                heartRate: "$avgHeartRate",
              },
              // completedChallenges: 1
            },
          },
        ],
        challengesCompleted: [
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        {
                          $eq: ["$status", "Completed"],
                        },
                        {
                          $eq: ["$completion", 100],
                        },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
      },
    },
  ];

  const analytics = await Challenge.aggregate(analyticsAggregation);

  if (analytics && !analytics.length)
    return next(ApiError.notFound(404, "Analytics not found"));
  return res
    .status(200)
    .json(new ApiResponse(200, analytics[0], "Analytics fetched successfully"));
});

//summarizes the users progress across all challenges
const userChallengeSummary = asyncHandler(async (req, res, next) => {
  const { user_id } = req.params;
  //Validate params
  const { error } = paramsSchema.validate({ user_id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  //check if user exists if not send a 404 not found error and block futher progress
  const isUser = await User.findById(user_id);
  if (!isUser) return next(ApiError.notFound(404, "User doesn't exist"));

  const aggregation = [
    {
      $match: {
        createdBy: formatAndConvertObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "activities",
        localField: "activities",
        foreignField: "_id",
        as: "activities",
      },
    },
    {
      $unwind: {
        path: "$activities",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: null,
        completedChallenges: {
          $sum: {
            $cond: [{ $eq: ["$status", "Completed"] }, 1, 0],
          },
        },
        currentChallenges: {
          $addToSet: {
            _id: "$_id",
            name: "$challengeName",
            completion: "$completion",
            startDate: "$startDate",
            endDate: "$endDate",
            status: "$status",
          },
        },
        totalCalories: {
          $sum: "$activities.calories",
        },
        avgHeartRate: {
          $avg: "$activities.heartRate",
        },
        totalDistance: {
          $sum: "$activities.distanceCovered",
        },
        totalSteps: {
          $sum: "$activities.stepsCount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        currentChallenges: {
          $sortArray: {
            input: {
              $filter: {
                input: "$currentChallenges",
                as: "challenge",
                cond: {
                  $eq: ["$$challenge.status", "In progress"],
                },
                limit: 3,
              },
            },
            sortBy: {
              endDate: 1,
            },
          },
        },
        metrics: {
          calories: "$totalCalories",
          steps: "$totalSteps",
          distance: "$totalDistance",
          heartRate: "$avgHeartRate",
        },
        // completedChallenges: 1
      },
    },
  ];

  const challengeSummary = await Challenge.aggregate(aggregation);
  const challenge = await Challenge.find({ status: "Completed" });
  if (challengeSummary && challengeSummary.length === 0)
    return next(ApiError.notFound(404, "No challenge summary found"));
  // if(challenge.length === 0) return next(ApiError.internalServerError(500, "Something went wrong"))
  const summary = Object.assign({}, challengeSummary[0], {
    completedChallenges: challenge.length,
  });
  return res
    .status(200)
    .json(
      new ApiResponse(200, summary, "Challenge summary fetched successfully")
    );
});

const workoutsSummary = asyncHandler(async (req, res, next) => {
  // const { user_id } = req.params;
  // const { error } = paramsSchema.validate({ user_id });
  // if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  const aggregation = [
    {
      $match: {},
    },

    {
      $group: {
        _id: "$workOutType",
        count: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: null,
        challenges: {
          $sum: 1,
        },
        completed: {
          $sum: {
            $cond: [
              {
                $eq: ["$completion", 100],
              },
              1,
              0,
            ],
          },
        },
        workouts: {
          $push: {
            type: "$_id",
            count: "$count",
          },
        },
      },
    },
    {
      $unwind: "$workouts",
    },
    {
      $project: {
        type: "$workouts.type",

        _id: 0,
        percentagePerWorkout: {
          $multiply: [
            {
              $divide: ["$workouts.count", "$challenges"],
            },
            100,
          ],
        },
      },
    },
  ];
  const workoutsSummary = await Challenge.aggregate(aggregation);
  if (!workoutsSummary && workoutsSummary.length)
    return next(ApiError.notFound(404, "No challenge summary found"));
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        workoutsSummary,
        "Workouts summary fetched successfully"
      )
    );
});

const pipeline = [
  {
    $match: {
      $or: [
        {
          operationType: "update",
        },
        {
          operationType: "insert",
        },
      ],
    },
  },
];
//set a timer to close a changestream
const closeChangeStream = async (timeoutMs = 15000, changestream) => {
  return setTimeout(() => {
    logger.info("Challenge change stream closed");
    changestream.close();
  }, timeoutMs);
};
//create and send a notification
const sendNotification = async (
  userId,
  message,
  notifyType = "achievement"
) => {
  await createNotification(userId, message, notifyType);
};

//check for anty challenges that are almost due by three days
const checkForAlmostDueChallenges = async (userId) => {
  const challenges = await Challenge.find({
    createdBy: userId,
    status: "In progress",
  });
  //filter vial all challenges that are due in 3 days and send a reminder notiification
  if (challenges && !challenges.length) return;
  challenges.forEach(async (challenge) => {
    if (getDateDifference(challenge.endDate) <= 3) {
      await sendNotification(
        challenge.createdBy,
        `You have ${getDateDifference(challenge.endDate)} days left to complete ${challenge.challengeName} challenge`,
        "reminder"
      );
    }
  });
};

//when an user interacts or completes a challenge we will send a notification
const monitorChallengeInteractions = async (
  model,
  timeoutMs = 60000,
  pipeline = [],
  options = {}
) => {
  //create change stream
  try {
    const changeStream = model.watch(pipeline, options);
    //add a listener
    changeStream.on("change", async (data) => {
      if (
        data.fullDocument &&
        data.fullDocument.completion === 100 &&
        data.fullDocument.status === "Completed"
      ) {
        await sendNotification(
          data.fullDocument.createdBy,
          `Congratulations, you have completed ${data.fullDocument.challengeName} challenge 🎉🎉 `
        );
      }
    });
    changeStream.on("error", (e) => {
      logger.error(e.message);
    });
    //closes the change stream after 1 minute
    // await closeChangeStream(timeoutMs, changeStream)
  } catch (e) {
    logger.error(e.message);
  }
};
await monitorChallengeInteractions(Challenge, pipeline, {
  fullDocument: "updateLookup",
});

const bookmarkChallenge = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const {error} = paramsSchema.validate({id})
  if(error) return next(ApiError.badRequest(400, formatError(error.message)))
  const challenge = await Challenge.findById(id)
  if(!challenge) return next(ApiError.notFound(404, "Challenge not found"))

    const isExistingChallange = await Challenge.findOne({
      challengeName: challenge.challengeName,
      createdBy: req.user._id,
    })
    if(isExistingChallange) return next(ApiError.conflictRequest(409, "Challenge already bookMarked"))

    const bookMarkedChallenge = await Challenge.create({
      challengeName: challenge.challengeName,
      workOutType: challenge.workOutType,
      description: challenge.description,
      image: challenge.image,
      createdBy: req.user._id,
      startDate: challenge.startDate,
      endDate: challenge.endDate,
      access: "Private",
      instructions: challenge.instructions,
    })
    if(!bookMarkedChallenge) return next(ApiError.internalServerError(500, "Could not bookmark challenge"))
    return res.status(201).json(new ApiResponse(201, bookMarkedChallenge, "Challenge bookmarked successfully"))
})
const  challengeStatistics = asyncHandler(async (req, res, next) => {
  const aggregation = [
      {
        $group: {
          _id: null,
          totalChallenges: {
            $sum: 1
          },
          activeChallenges: {
            $sum: {
              $cond:[
                {
                  $eq:[
                    "$status",
                    "In progress"
                  ]
    },
                1,0
                
              ]
            }
          
          }
        }
      }
    ]
  
    const statistics = await Challenge.aggregate(aggregation)
    if(statistics && !statistics.length ) return next(ApiError.notFound(404, "Challenge statistics not found"))

   return res.status(200).json(new ApiResponse(200, statistics[0], "Challenge statistics fetched successfully"))
})

const challengeCompletionRate = asyncHandler(async (req, res, next) => {
  const {page, limit} = req.query
  const {error} = paginateSchema.validate({page, limit})
  if(error) return next(ApiError.badRequest(400, formatError(error.message)))
  const options = {
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    lean: true
  }
 

  const aggregation = [
    {
      $sort: {
        createdAt: 1
      }
    },
    {
      $group: {
        _id: null,
        completionRate: {
          $push: {
            title: "$challengeName",
            completion: "$completion"
          }
        }
      }
    },
    {
      $project: {
        _id: 0
      }
    }
  ]
  const aggregate =  Challenge.aggregate(aggregation)

  const results = await Challenge.aggregatePaginate(aggregate, options);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        rates: results.docs,
        pagination: {
          total: results.totalDocs,
          totalPages: results.totalPages,
          currentPage: results.currentPage,
          hasNextPage: results.hasNextPage,
          hasPrevPage: results.hasPrevPage,
          nextPage: results.nextPage,
          prevPage: results.prevPage,
        },
      },
      "Challenge rates fetched successfully"
    )
  );
})
export {
  getPublicChallenges,
  getChallenges,
  getAllUserChallenges,
  getChallenge,
  createChallenge,
  bookmarkChallenge,
  updateChallenge,
  deleteChallenge,
  searchForChallenges,
  challengeProgress,
  userChallengeSummary,
  workoutsSummary,
  userAnalytics,
  checkForAlmostDueChallenges,
  challengeStatistics,
  challengeCompletionRate
};
