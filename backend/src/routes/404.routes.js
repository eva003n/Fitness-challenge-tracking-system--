import { Router } from "express";
import notFound from "../controllers/notFound.controller.js";

const router = Router();

router.route("*").all(notFound);

export default router;
