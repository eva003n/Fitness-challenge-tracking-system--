import { Router } from "express";

import {
  signUp,
  logIn,
  logOut,
  tokenRefresh,
  thirdPartySignInWithGithub,
  thirdPartySignIn,
} from "../controllers/authentication.controllers.js";

const router = Router();

//authentication endpoints
router.route("/signup").post(signUp);
router.route("/login").post(logIn);
router.route("/logout").delete(logOut);
router.route("/refreshtoken").post(tokenRefresh);
router.route("/github/oauth").post(thirdPartySignInWithGithub);
router.route("/oauth2").post(thirdPartySignIn);

export default router;
