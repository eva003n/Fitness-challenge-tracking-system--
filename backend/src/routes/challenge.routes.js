import { Router } from "express";
import {
  getPublicChallenges,
  getAllUserChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  searchForChallenges,
  getChallenge,
  challengeProgress,
  userChallengeSummary,
  workoutsSummary,
  userAnalytics,
  getChallenges,
  bookmarkChallenge,
  challengeStatistics,
  challengeCompletionRate
} from "../controllers/challenge.controller.js";
import { protectRoute, roleCheck } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/multer.middleware.js";

const router = Router();
//gets all the challanges created
router.route("/").get(protectRoute, getPublicChallenges);
//search for based on challengename and workouttype challanges
router.route("/search").get(protectRoute, searchForChallenges);
//get all challenges belonging to a user id
router.route("/user/:id").get(protectRoute, getAllUserChallenges);
//create a new challenge
router.route("/").post(protectRoute, uploadSingle("image"), createChallenge);
//get a specific challenge by its id
router.route("/challenge/:id").get(protectRoute, getChallenge);
//update a challenge by id
router.route("/challenge/:id").put(protectRoute, uploadSingle("image"), updateChallenge);
router.route("/:id/bookmark").post(protectRoute, bookmarkChallenge)
//delete a specific challange by id
router.route("/challenge/:id").delete(protectRoute, deleteChallenge);
router.route("/challenge/:id/progress").get(protectRoute, challengeProgress)
router.route("/:user_id/summary").get(protectRoute, userChallengeSummary)
router.route("/summary/workouts").get(protectRoute, workoutsSummary)
router.route("/analytics/:user_id").get(protectRoute, userAnalytics)

//admin routes
router.route("/admin").get(protectRoute, roleCheck, getChallenges);
router.route("/completionrate").get(protectRoute, roleCheck, challengeCompletionRate);
router.route("/admin/statistics").get(protectRoute, roleCheck, challengeStatistics);

export default router;
