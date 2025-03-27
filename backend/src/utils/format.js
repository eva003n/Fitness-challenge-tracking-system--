//format the default joi error responses
function formatError(error) {
    return error
      .toString()
      .split("")
      .filter((char) => char !== '"')
      .join("");
  }
  export default formatError;
  