import { Router } from "express";
import ApiResponse from "../utils/ApiResponse.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/", protectRoute, (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Welcome to the Fitness challenge Tracker API"));
});
export default router;
