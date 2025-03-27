import ApiError from "../utils/ApiError.js";
import logger from "../logger/logger.winston.js";
import multer from "multer";
import mongoose from "mongoose";

const apiErrorHandlerMiddleware = (err, req, res, next) => {
  //err is an error object eitheir your custom err object or defaulrs to express error object
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err);
  }
  if(err.name === "TokenExpiredError") {
    return res.status(401).json(ApiError.unAuthorizedRequest(401, "Token expired, please login again"));
  }
  
  //if error is from multer
  if(err instanceof multer.MulterError) {
    if(err.message === 'Unexpected field') {
      return res.status(422).json(ApiError.unprocessable(422, "Cannot upload more than one file"))
    }else {
      return res.status(422).json(ApiError.unprocessable(422, `${err.message} at  field named ${err.field}`))
    }
   

  }
  //if error is from mongoose

  if(err instanceof mongoose.Error) {
    logger.error(err.message)
// return res.status(404).json(ApiError.notFound(404, err.message))
    //document with corresponding id not found
  if(err.name ===  "DocumentNotFoundError") {
    return res.status(404).json(ApiError.notFound(404, err.message))
  }

  }
  
  //any other errors
  return res.status(500).json(new ApiError(500, err.message || "Something went wrong, try again"));
};
export { apiErrorHandlerMiddleware };
