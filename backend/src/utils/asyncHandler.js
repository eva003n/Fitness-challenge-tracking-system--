//returning a function that calls the callback function it receives inside a promise wrapper to handle any errors that occure then send those errors to the global middleware to handles error globally

//this is the best approach to reduce overhead of using try-catch blocks

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err, session) => {
     
      return next(err);
    });
  };
};

export default asyncHandler;
