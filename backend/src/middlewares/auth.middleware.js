import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";

const protectRoute = asyncHandler(async (req, res, next) => {
  //with each req made check the validity of access token
  const { AccessToken } = req.cookies || req.body;

  if (!AccessToken) {
    return next(ApiError.unAuthorizedRequest(401, "Unauthorized request"));
  }

  const decodeToken = jwt.verify(AccessToken, process.env.ACCESS_TOKEN_SECRET);

  //cannot decode token then token is invalid
  if (!decodeToken) {
    return next(
      ApiError.badRequest(401, "Unauthorized request, invalid access token ")
    );
  }
  //Can decode token but is not an existing user
  const user = await User.findById(decodeToken.userId);
  if (!user) {
    return next(
      ApiError.unAuthorizedRequest(
        401,
        "Unauthorized request, user doesn't exist or is already deleted"
      )
    );
   
  }

  req.user = user;
  //call the next middleware in the stack
  next();
});

//role based authentication
const roleCheck = asyncHandler(async(req, res, next) => {
  //since this route is already protected by the protect route middleware, this means that at this point we have an authenticated user now lets perform some authorixation
  //this middleware protects the admin routes
  //we have access to the user in the request object thus no nned to query the database
  //perform a role check so that only admins are allowed otherwise a 403 forbidden error is thrown
  if(req.user.role !== "admin")
    return next(ApiError.forbiddenRequest(403, "Unauthorized request, only admins are allowed to access this resource"))
//at this point the user is an admin thus proceed
  next()  
})
export {
  protectRoute,
  roleCheck
}
