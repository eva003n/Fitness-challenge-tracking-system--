import { Router } from "express";
import { protectRoute }from "../middlewares/auth.middleware.js";
import { createActivity, updateActivity, deleteActivity, getAllActivities, getActivityBYChallenge, getActivity, deleteAllActivities, activityProgress, getUserAtivitySummary } from "../controllers/activity.controller.js";

const router = Router();

//Progress tracking metrics
//this endpoints allow the user to log their proghress data based on challenge workouy type

router.route("/").post(protectRoute, createActivity);
//get all metrics for all the challages
router.route("/").get(protectRoute, getAllActivities);
//get metrics for a specific challenge
router.route("/activity/challenge/:id").get(protectRoute, getActivityBYChallenge);
//update m,etrics for specific challange
router.route("/activity/:id").get(protectRoute, getActivity);
router.route("/activity/:id").put(protectRoute, updateActivity);
//delete ,metrics for a particular challnege
router.route("/activity/:id").delete(protectRoute, deleteActivity);
// router.route("/activity/").delete(protectRoute, deleteAllActivities);
router.route("/").delete(protectRoute, deleteAllActivities);
router.route("/progress/user/:id").get(protectRoute, activityProgress)
router.route("/:user_id/summary").get(protectRoute, getUserAtivitySummary)



export default router;
