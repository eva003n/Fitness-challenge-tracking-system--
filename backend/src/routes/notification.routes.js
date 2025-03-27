import { Router } from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router()

router.route("/user/:id").get( protectRoute,  getNotifications)
router.route("/:id").put(protectRoute, markAsRead)

export default router