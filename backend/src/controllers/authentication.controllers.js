import { autheticationSchema } from "../middlewares/validator.js";
import jwt from "jsonwebtoken";
import ApiErrorcons from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import User from "../models/user.model.js";
import formatError from "../utils/format.js";
import axios from "axios";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const signUp = asyncHandler(async (req, res, next) => {
  //create a transaction first create a session and then create a new user
  const session = await mongoose.startSession();
  //start transaction
  await session.startTransaction();
  const { email, password } = req.body;
  //validation
  const { error } = autheticationSchema.validate({
    email,
    password,
  });
//in case of validation error send an error response 
  if (error) {
    return next(
      ApiError.badRequest(
        400,
        formatError(error.message) 
      ),
      session
    );
  }
  // check if user exist before creating new user to avoid duplicate user accounts and mongoose throwing a duplcate error due to email havibg a unique index
  const isExistingUser = await User.findOne({ email });

  //if user account already exist send back an error response and cancel transaction
  if (isExistingUser) {
    return next(
      ApiError.conflictRequest(409, "Account exists, login to your account"),
      session
    );
  }

  //if user account doesnt exists create one
  const newUser = await User.create({
    email,
    password,
    userName: `@${email.split("@")[0]}`, //default username with first part of email address
  });

  //if transaction succeeds commit and end transaction
  await session.commitTransaction();

  //end transaction after its done
  await session.endSession();

  //hide password for security purposes so it doesn't appear in the response object
  newUser.password = undefined;
  //when newuser is not created and is null close the transaction
  if (!newUser) {
    session.abortTransaction();
    session.endSession();
  }
  return res
    .status(201)
    .json(new ApiResponse(201, newUser, "Account created successfully"));
});

const logIn = asyncHandler(
  //user credentials, validate them before generating a token
  //Avoid long if statements they cause a situation where a response is not sent back when a cond is not satisfied  which is not a good experience for the client
  async (req, res, next) => {
    const { email, password } = req.body;
    const { error } = autheticationSchema.validate({
      email,
      password,
    });
    // validation error
    if (error) {
      return next(ApiError.badRequest(400, formatError(error.message)));
    }

    //returns a document that matches email and includes password field in query
    const isExistingUser = await User.findOne({ email }).select("+password");
    //if existing account is null means that account doesnt exist
    if (!isExistingUser) {
      return next(
        ApiError.badRequest(404, "Account doesn't exist, create an account")
      );
    }

    //this wont work if passowrd is hidden so u must include it in query, check if the password entered and the stored hashed password match
    const isValidPassword = await isExistingUser.isMatchingPassword(password);

    if (!isValidPassword) {
      return next(
        ApiError.unAuthorizedRequest(401, "Invalid email or password")
      );
    }
 
    //generate token for user session
    const { accessToken, refreshToken } = generateToken(
      isExistingUser._id,
      isExistingUser.email,
      isExistingUser.role
    );
    //store refresh tolen in db
    isExistingUser.refreshToken = refreshToken;
    await isExistingUser.save();
   //hide password after making it visible in query
    //hide the password and refresh token after saving to db to prevent it fom appearing in response which is not secure
    isExistingUser.password = undefined;
    isExistingUser.refreshToken = undefined;
    //configure and send cookie
    // configureCookie(res, accessToken, refreshToken);

    return res
      .status(200)
      .cookie("AccessToken", accessToken, {
        httpOnly: true, //prevent xss attacks
        maxAge: 15 * 60 * 1000, //15min
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict", //CSRF cross site resource forgery attack
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      })
      .cookie("RefreshToken", refreshToken, {
        httpOnly: true, //prevent xss attacks,cookie being accessed via js
        secure: process.env.NODE_ENV === "production", //work only with https in production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, //7day
      })
      .json(
        new ApiResponse(
          200,
          { user: isExistingUser, accessToken },
          "Logged in successfully"
        )
      );
  }
);

const thirdPartySignIn = asyncHandler(async (req, res, next) => {
  //Authrization code sent by identity provider Authorization server on the frontend
  const { authorizationCode } = req.body;

  if (!authorizationCode) {
    return next(ApiError.badRequest(400, "Authorization code is required"));
  }

  axios.defaults.headers.accept = "application/json";
  //send authorization code to authrization server to receive an access token that will use to fetch users data
  const resp = await axios.post(
    process.env.GITHUB_ACCESS_TOKEN_URL,
    {
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    },

    {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: authorizationCode,
      },
    }
  );

  const { access_token } = resp.data;
  if (!access_token) return;
  //get user details using the access token from the resource server
  const response = await axios.get(process.env.GITHUB_USER_URI, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  const { data } = response;
  if (!data) return;
//check if the user is an existing user
  const isExistingUser = await User.findOne({ email: data.email });

   //generate token for user whether its a new user or existing user

  //if its not an existing account create one
  let newUser = "";
  if (!isExistingUser) {
    newUser = await User.create({
      userName: data.login,
      name: data.name,
      email: data.email,
      avatar: {
        imageUrl: data.avatar_url,
      },
    });
  }
  //generate a token conditionaly, whether its an exiting user or a new one
  const { accessToken, refreshToken } = generateToken(
    (newUser && newUser._id) || isExistingUser._id,
    (newUser && newUser.email) || isExistingUser.email,
    (newUser && newUser.role) || isExistingUser.role
  );
  //save refresh token to database conditionally
if(newUser) {
  newUser.refreshToken = refreshToken
  await newUser.save();
}else {
  isExistingUser.refreshToken = refreshToken
  await isExistingUser.save();
}

//hide the refresh token and password after saving to db to prevent it from appearing in response which is not secure
 newUser? newUser.refreshToken = undefined : isExistingUser.refreshToken = undefined;
 newUser? newUser.password = undefined : isExistingUser.password = undefined;

  return res
    .status(200)
    .cookie("AccessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict", //CSRF cross site resource forgery attack
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 15 * 60 * 1000, //15min
    })
    .cookie("RefreshToken", refreshToken, {
      httpOnly: true, //prevent xss attacks,cookie being accessed via js
      secure: process.env.NODE_ENV === "production", //work only with https in production
      // sameSite: "strict",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7day
    })
    .json(
      new ApiResponse(
        200,
        { user: newUser || isExistingUser, accessToken },
        "Logged in successfully"
      )
    );
});

const logOut = asyncHandler(async (req, res, next) => {
  //check cookie in request for refresh token
  const refreshToken = req.cookies.RefreshToken;
  if (!refreshToken)
    return next(ApiError.badRequest(400, "Refresh token is required"));
  //check if the refresh token sent by the client matches  secret and is not tampered with
  const decodeToken = jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  if (!decodeToken)
    return next(
      ApiError.unAuthorizedRequest(
        401,
        "Unauthorized request, invalid refresh token "
      )
    );
  //delete refresh token of currently logged in user from db and return update doc
  const currentUser = await User.findOneAndUpdate(
    { _id: decodeToken.userId },
    { $unset: { refreshToken: " " } },
    { new: true }
  ).exec();
  if (!currentUser) return next(ApiError.notFound(404, "User does not exist"));

  return res
    .status(200)
    .clearCookie("AccessToken")
    .clearCookie("RefreshToken")
    .json(new ApiResponse(200, {}, "Logged out successfull"));
});

//refresh token
const tokenRefresh = asyncHandler(async (req, res, next) => {
  //incoming refresh token
  const { RefreshToken } = req.cookies || req.body;

  if (!RefreshToken)
    return next(ApiError.badRequest(400, "Refresh token is required"));

  //check if refreshtoken matches the secret used to sign it

  const decodeToken = jwt.verify(
    RefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  if(!decodeToken) return next(ApiError.unAuthorizedRequest(401, "Unauthorized, invalid refresh token"))
//check if refresh token matches the one in db
  const user = await User.findById(decodeToken.userId).select("+refreshToken");
  if (!user) return next(ApiError.notFound(404, "User does not exist"));

  if (RefreshToken !== user.refreshToken) {
    return next(
      ApiError.unAuthorizedRequest(401, "Unauthorized, invalid refresh token")
    );
  }

  const { accessToken, refreshToken } = generateToken(
    user._id,
    user.email,
    user.role
  );
  // configureCookie(res, accessToken, refreshToken);

  if (refreshToken) user.refreshToken = refreshToken;
  await user.save();
  //hide token after saving to prevent  appearance in response
  user.refreshToken = undefined;

  return res
    .status(200)
    .cookie("AccessToken", accessToken, {
      httpOnly: true, //prevent xss attacks
      maxAge: 15 * 60 * 1000, //15min
      secure: process.env.NODE_ENV === "production",
      // sameSite: "strict", //CSRF cross site resource forgery attack
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    })
    .cookie("RefreshToken", refreshToken, {
      httpOnly: true, //prevent xss attacks,cookie being accessed via js
      secure: process.env.NODE_ENV === "production", //work only with https in production
      // sameSite: "strict",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 days
    })
    .json(
      new ApiResponse(200, accessToken, "Access token generated successfully")
    );
});

//generate authntication token
const generateToken = (userId, userEmail, role = "user") => {
  const accessToken = jwt.sign(
    //header => algo token type
    //payload
    {
      userId,
      userEmail,
      role,
    },
    //signing secret
    process.env.ACCESS_TOKEN_SECRET,
    {
      issuer: "Fit track",
      expiresIn: process.env.ACCESS_TOKEN_EXPTRY,
      subject: "authentication",
    }
);
  const refreshToken = jwt.sign(
    //header => algo token type
    //payload
    {
      userId,
      userEmail,
      role,
    },
    //secretorprivatekey
    process.env.REFRESH_TOKEN_SECRET,
    //registered claims
    {
      issuer: "Fit track",
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      subject: "authentication",
    }
  );
  return { accessToken, refreshToken };
};
//configure and send refresh
const configureCookie = (res, accessToken, refreshToken) => {
  return res.cookie("AccessToken", accessToken, {
    httpOnly: true, //prevent xss attacks
    maxAge: 15 * 60 * 1000, //15min
    secure: process.env.NODE_ENV === "production",
    // sameSite: "strict", //CSRF cross site resource forgery attack
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  })
  .cookie("RefreshToken", refreshToken, {
    httpOnly: true, //prevent xss attacks,cookie being accessed via js
    secure: process.env.NODE_ENV === "production", //work only with https in production
    // sameSite: "strict",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, //7days
  });
};
export { signUp, logIn, logOut, thirdPartySignIn, tokenRefresh };
