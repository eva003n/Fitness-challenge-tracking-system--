import {Router} from "express";
import healthCheck from "../controllers/healthCheck.controller.js";

const router = Router();
//pass to  the handler fo the request
router.route("/").get(healthCheck);
router.route("/test").get(healthCheck);

export default router;