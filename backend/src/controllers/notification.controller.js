import { paramsSchema } from "../middlewares/validator.js";
import Notification from "../models/notificstion.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import formatError from "../utils/format.js";
import { emitSocketEvent } from "../app.js";
import { formatAndConvertObjectId } from "../utils/index.js";
import { SOCKETEVENTENUM } from "../constants.js";

const getNotifications = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const { error } = paramsSchema.validate({ id });
  if (error) return next(ApiError.badRequest(400, formatError(error.message)));

  const notifications = await Notification.find({ userId:id }).sort({createdAt: -1});

  // emitSocketEvent(req, user_id, "notification", notifications);
  if (!notifications || !notifications.length)
    return
  //  next(ApiError.notFound(404, "No notifications yet"));

  return res
    .status(200)
    .json(
      new ApiResponse(200, notifications, "Notifications fetched successfully")
    );
});

const markAsRead = asyncHandler(async (req, res, next) => {
  const {id} = req.params
  const {error} = paramsSchema.validate({id})
  if(error) return next(ApiError.badRequest(400, formatError(error.message)))

  const notification = await Notification.findById(id );
  if(!notification) return next(ApiError.notFound(404, "Notification not found"))
  //if notification is already marked as read exit otherwise continue
  if(notification.seen) return
  //  next(ApiError.badRequest(400, "Notification already marked as read"))

  // update
  notification.seen = true
  await notification.save()
  return res.status(200).json(new ApiResponse(200, notification, "Notification marked as read"))
})

const createNotification = async( userId, message, notifyType) => {
  //prevent duplicate notificaions


  const notification = await Notification.create({
    message,
    userId,
    notifyType
  })
  console.log(notification)

   return emitSocketEvent(String(userId), SOCKETEVENTENUM.NOTIFY_EVENT, notification)

}


export { getNotifications, markAsRead, createNotification };
