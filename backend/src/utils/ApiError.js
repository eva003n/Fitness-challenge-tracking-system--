class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong, try again",
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.data = null;
    this.error = message;
    // if their is a stack trace populate the stack preopety  else create one
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  static badRequest(statusCode, message) {
    return new ApiError(statusCode, message);
  }

  static unAuthorizedRequest(statusCode, message) {
    return new ApiError(statusCode, message);
  }
  static conflictRequest(statusCode, message) {
    return new ApiError(statusCode, message);
  }
  static notFound(statusCode, message) {
    return new ApiError(statusCode, message);
  }

  static unprocessable(statusCode, message) { 
    return new ApiError(statusCode, message);
  }
  static tooManyRequest(statusCode, message) {
    return new ApiError(statusCode, message);
  }
  static forbiddenRequest(statusCode, message) {
    return new ApiError(statusCode, message)
  }
  static internalServerError(statusCode=500, message="Something went wrong, try again") {
    return new ApiError(statusCode, message);
  }
}
export default ApiError;
