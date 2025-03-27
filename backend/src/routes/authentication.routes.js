import { Router } from "express";

import {
  signUp,
  logIn,
  logOut,
  tokenRefresh,
  thirdPartySignIn
} from "../controllers/authentication.controllers.js";



const router = Router();

//authentication endpoints
router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/logout").delete(logOut);
router.route("/refreshtoken").post(tokenRefresh);
router.route("/github/oauth").post(thirdPartySignIn)

export default router;
