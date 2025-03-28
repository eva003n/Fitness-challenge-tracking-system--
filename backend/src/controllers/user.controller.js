import { profileSchema, paramsSchema, paginateSchema } from "../middlewares/validator.js";
import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { cloudinary, options } from "../config/cloudinary/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import formatError from "../utils/format.js";
import {
  formatAndConvertObjectId,
  getDayStart,
  similarityCheck,
  addOneDayAndVerify,
  getIsoDate,
} from "../utils/index.js";
import { createNotification } from "./notification.controller.js";
import { emitSocketEvent } from "../app.js";
import { SOCKETEVENTENUM } from "../constants.js";
import { querySchema } from "../middlewares/validator.js";

const getUser = asyncHandler(async (req, res, next) => {
  //get single user by id
  const { id } = req.params;

  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const user = await User.findById(id);
  if (!user) next(ApiError.notFound(404, "User doesn't exists"));

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

const updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { error: paramsError } = paramsSchema.validate({ id });
  if (paramsError)
    return next(ApiError.badRequest(400, formatError(paramsError.message)));
  const { email, userName, bio, name, socialsLinks, password, weight, role, active } =
    req.body;

  const { error } = profileSchema.validate({
    email,
    userName,
    bio,
    name,
    weight,
    socialsLinks,
    password,
    weight,
    role,
    active
  });


  if (error) {
    next(ApiError.badRequest(400, formatError(error.message)));
    return;
  }

  //check if user profile already exists
  const isUser = await User.findById(id);
  if (!isUser) {
    return next(ApiError.notFound(404, "User doesn't exists"));
  }
  //upload avatar to cloudinary if avatar is updated
  let result = "";
  if (req.file) {
    result = await uploadToCloudinary(req.file.buffer);
    if(isUser.avatar.imageUrl) {

    }

    (isUser.avatar.imageUrl = result.secure_url), //if no image uploaded use the existing image
      (isUser.avatar.imageId = result.public_id);

    await isUser.save();
  }
  //find user and created profile
  const updatedUser = await User.findOneAndUpdate(
    { _id: formatAndConvertObjectId(id) },
    {
      userName,
      email,
      bio,
      name,
      socialsLinks,
      password,
      weight,
      role
    },

    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser)
    return next(
      ApiError.internalServerError(500, "Something wemt wrong, try again")
    );

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "User updated successfully"));
});

//Function that keeeps track of users streals

const updateUsersStreak = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  //validation
  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const user = await User.findById(id);

  //reset the current date to the start of the day
  const today = getDayStart();
  //get the last streaks update
  const lastStreakUpdate = getDayStart(user.streaks.lastUpdate);

  //check if last update in terms of day  is same as today if true exit otherwise continue
  if (similarityCheck(today, lastStreakUpdate)) {
    return
    //  next(ApiError.conflictRequest(409, "Streak already updated")); // exit if already updated
  }
  //if last update plus one day is same as today increase streak otherwise reset

  if (addOneDayAndVerify(today, lastStreakUpdate)) {
    user.streaks.current += 1;
    // emitSocketEvent(String(user._id), SOCKETEVENTENUM.UPDATE_USER_STREAK, user.streaks.current);
 
    await createNotification(
      user._id,
      `New milestone reached! You are unstoppable, ${user.streaks.current} day streaks gained 🔥🔥`,
      "streaks"
    );
  } else {
    user.streaks.current = 0;
    // emitSocketEvent(String(user._id), SOCKETEVENTENUM.UPDATE_USER_STREAK, 0);

    await createNotification(
      user._id,
      `💔😟 Ooops! Your ${user.streaks.current} day streaks just broke`,
      "streaks"
    );
  }

  //if longest streak is the max btw the two
  user.streaks.best = Math.max(user.streaks.current, user.streaks.best);
  //set last update to today
  user.streaks.lastUpdate = getIsoDate(new Date());
  const updatedUser = await user.save();
  emitSocketEvent(String(user._id), SOCKETEVENTENUM.UPDATE_USER_STREAK, updatedUser);
  

  return res.status(201).json(
    new ApiResponse(201, updatedUser, "Streak updated successfully")
  );


});

//admin coontrollers
const createUser = asyncHandler(async (req, res, next) => { 
  const { email, userName, bio, name, socialsLinks, password, weight, avatar, role, active } = req.body;

  const { error } = profileSchema.validate({
    email,
    name,
    password,
    role,
  });

  if (error) {
    next(ApiError.badRequest(400, formatError(error.message)));
    return;
  }

  //check if user  already exists
  const isUser = await User.findOne({ email });
  if (isUser) {
    return next(ApiError.badRequest(400, "User already exists"));
  }
  //upload avatar to cloudinary if avatar is updated
  // let result = "";
  // if (req.file) {
  //   result = await uploadToCloudinary(req.file.buffer);
  // }
  //create user profile
  const newUser = await User.create({
    email,
    userName: `@${email.split("@")[0]}`,
    password,
    role
  });

  if (!newUser)
    return next(
      ApiError.internalServerError(500, "Something wemt wrong, try again")
    );

  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "User created successfully"));
});

const deleteUser = async (req, res, next) => {
  const { id } = req.params;

  const isUser = await User.findById(id);

  //first check that the account actually exists before deleting
  //if user account does not exist return error
  if (!isUser) {
    return next(ApiError.notFound(404, "User doesn't exists"));
  }

  //if is user find and delete the account of the currently logged in user
  const deletedUser = await User.deleteOne({ _id: id });

  if (deletedUser.deletedCount && deletedUser.acknowledged)
    return res
      .status(200)
      .cookie("Bearer", "")
      .cookie("RefreshToken", "")
      .json(new ApiResponse(200, {}, "User deleted successfully"));
};
const resetUserpassword = asyncHandler(async (req, res, next) => { 
  const {id} = req.params;
  const {password} = req.body;
  const { error } = profileSchema.validate({
    password
  });

  if (error)  return next(ApiError.badRequest(400, formatError(error.message)));

  //check if user exists
  const user = await User.findById(id);
  if(!user) return next(ApiError.notFound(404, "User doesn't exist"));
  //update the user password
  user.password = password;
  const updateduser = await user.save();

  if(!updateduser) return next(ApiError.internalServerError(500, "Something went wrong, try again"));

  return res.status(201).json(new ApiResponse(201,  "Password reset successfully"));

});

const getAllUsers = asyncHandler(async (req, res, next) => {
  //get all users
  let { page, limit } = req.query;

  const { error } = paginateSchema.validate({ page, limit });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));
  //convert to number and assign default values if not provided
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  
  const options = {
    page,
    limit,
    // sort: { createdAt: 1 },
    lean: true,
  };

  const aggregate =  User.aggregate([
    {
      $match: {},
    },
    {
      $sort: { email: 1 },
    },
    {
      $project: { 
        email: 1,
        userName: 1,
        avatar: 1,
        role: 1,
        active: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    }
  ])

    const results = await User.aggregatePaginate(aggregate, options);

return res.status(200).json(
    new ApiResponse(
      200,
      {
        users: results.docs,
        pagination: {
          total: results.totalDocs,
          totalPages: results.totalPages,
          currentPage: results.page,
          hasNextPage: results.hasNextPage,
          hasPrevPage: results.hasPrevPage,
          nextPage: results.nextPage,
          prevPage: results.prevPage,
        },
      },
      "Users fetched successfully"
    )
  );
});


const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const analytics = asyncHandler(async (req, res, next) => {

  const aggregation = [
    
      {
        $addFields: {
          currentYear: {
            $year: "$$NOW"
          },
          currentMonth: {
            $month: "$$NOW"
          }
        }
      },
    
      {
        $group: {
          _id: null,
          totalUsers: {
            $sum: 1
          },
          newUsers: {
            $sum: {
              $cond: [
                {
                  $and: [
                    {
                      $eq: [
                        {
                          $year: "$createdAt"
                        },
                        "$currentYear"
                      ]
                    },
                    {
                      $eq: [
                        {
                          $month: "$createdAt"
                        },
                        "$currentMonth"
                      ]
                    }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
  
  
  ]
  const analytics = await User.aggregate(aggregation);
  if (analytics && !analytics.length) return next(ApiError.notFound(404, "No analytics found"));
  return res.status(200).json(new ApiResponse(200, analytics[0], "Users analytics fetched successfully"));

})
  


export {
  createUser,
  resetUserpassword,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  uploadToCloudinary,
  updateUsersStreak,
  analytics

};
