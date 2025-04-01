import Joi from "joi";
const autheticationSchema = Joi.object({
  email: Joi.string()
    .trim()
    .min(8)
    .max(60)
    .required("Email is required")
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string()
    .trim()
    .min(8)
    .max(30)
    .required("Password is required")
    .pattern(new RegExp("^(?![._])([a-zA-Z][a-zA-Z0-9._]{7,19})(?<![._])$"))
    .message("Password is too weak!"),
});

const profileSchema = Joi.object({
  bio: Joi.string().trim(),
  userName: Joi.string().allow(""),
  name: Joi.string().allow(""),
  socialsLinks: Joi.object({
    facebook: Joi.string().allow(""),
    twitter: Joi.string().allow(""),
    instagram: Joi.string().allow(""),
    tiktok: Joi.string().allow(""),
  }),
  birthDate: Joi.date()
    .max("now")
    .message("Birth date must use this format [YYYY-MM-DD]"),
  weight: Joi.number(),
  height: Joi.number(),
  email: Joi.string()
    .trim()
    .allow("")
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
  password: Joi.string()
    .trim()
    .allow("")
    .pattern(new RegExp("^(?![._])([a-zA-Z][a-zA-Z0-9._]{7,19})(?<![._])$"))
    .message("Password is too weak!"),
  avatar: Joi.object(),
  role: Joi.string().valid("user", "admin"),
  active: Joi.boolean(),
});
const paramsSchema = Joi.object({
  id: Joi.string().min(24).max(24),
  user_id: Joi.string().min(24).max(24),
})
  .or("id", "user_id")
  .custom((value, helpers) => {
    if (!value.id && !value.user_id) return helpers.error("any.required");
    return value;
  });
const challengeSchema = Joi.object({
  challengeName: Joi.string().trim().min(3).max(50),
  createdBy: Joi.string().trim().min(24).required("User id is required"),

  description: Joi.string().trim().min(5).max(30),
  startDate: Joi.date(),
  endDate: Joi.date().min(new Date()),
  workOutType: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required("Workout type is required"),
  difficulty: Joi.string().trim(),
  status: Joi.string().trim().min(5).valid("Completed", "In progress"),
  access: Joi.string().allow("public", "private"),
  instructions: Joi.string().trim().allow(""),
});
const createActivitySchema = Joi.object({
  //   challengeId: Joi.string().trim().min(24).max(24).required("Challenge id is required"),
  //   workout: Joi.string().trim().min(3).max(20).required(),

  // activity: Joi.string().trim().min(3).max(20).required(),
  // userId: Joi.string().min(24).max(24).required("User id is required"),
  // challengeId: Joi.string().trim().min(24).max(24).required("Challenge id is required"),
  // date: Joi.date().required("Date is required"),
  challengeId: Joi.string(),
  workout: Joi.string(),
  distanceCovered: Joi.number(),
  calories: Joi.number(),
  heartRate: Joi.number(),
  stepsCount: Joi.number(),
  activity: Joi.string(),
  date: Joi.date().required("Date is required"),
  reps: Joi.number(),
  userId: Joi.string().min(24).max(24).required("User id is required"),
  // .when("workout", {
  //   is: Joi.string().valid("Strength training"),
  //   then: Joi.required(),
  //   otherwise: Joi.forbidden()
  // }),

  weightLifted: Joi.number(),
  // .when("workout", {
  //   is: Joi.string().valid("Strength training"),
  //   then: Joi.required(),
  //   otherwise: Joi.forbidden()
  // }),

  // userId: Joi.string().min(24).max(24).required("User id is required"),

  status: Joi.string(),
});
const convertToNumber = (value = 0, helper) => {
  const number = Number(value);
  //coversion fails return a validation error
  if (isNaN(number)) {
    return helper.erro("any.invalid");
  }
  //succeeds
  return number;
};
const activitySchema = Joi.object({
  challengeId: Joi.string(),
  workout: Joi.string(),
  distanceCovered: Joi.number(),
  calories: Joi.number(),
  heartRate: Joi.number(),
  stepsCount: Joi.number(),
  activity: Joi.string(),
  reps: Joi.number(),
  // .when("workout", {
  //   is: Joi.string().valid("Strength training"),
  //   then: Joi.required(),
  //   otherwise: Joi.forbidden()
  // }),

  weightLifted: Joi.number(),
  // .when("workout", {
  //   is: Joi.string().valid("Strength training"),
  //   then: Joi.required(),
  //   otherwise: Joi.forbidden()
  // }),

  // userId: Joi.string().min(24).max(24).required("User id is required"),

  status: Joi.string(),
});
const querySchema = Joi.object({
  year: Joi.number(),
  month: Joi.number(),
  // page: Joi.number(),
  // limit: Joi.number(),
})

  .or("year", "month", "page", "limit")
  .custom((value, helpers) => {
    if (!value.year && !value.month) return helpers.error("any.required");
    return Number(value);
  });
  const paginateSchema = Joi.object({
  page: Joi.number().required(),
  limit: Joi.number().required(),
});
export {
  autheticationSchema,
  paginateSchema,
  profileSchema,
  paramsSchema,
  challengeSchema,
  activitySchema,
  querySchema,
  createActivitySchema,
};
