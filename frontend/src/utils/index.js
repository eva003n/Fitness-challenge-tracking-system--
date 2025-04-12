
const getWholeNumber = (number) => Math.floor(number) 
// get authorization code from querystring
const getAuthorizationCode =  () => {
    const authorizationCode = new URLSearchParams(window.location.search).get(
      "code"
    );
  
    return authorizationCode;
  
};
const getGoogleAuthorizationUrl = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const options = {
        redirect_uri: import.meta.env.VITE_GOOGLE_REDIRECT_URL,
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        state: import.meta.env.VITE_OAUTH_STATE,
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" ")

    }

    const queryString = new URLSearchParams(options)
    return `${rootUrl}?${queryString.toString()}`


}

const retryRequest = (apiClient, request, timeout ) => {
    const failedRequest = request
    const timeoutMs = setTimeout(() => {
    if(!failedRequest._retry) {
            failedRequest._retry = true
            return apiClient(failedRequest)

        }

    }, timeout) 
    clearTimeout(timeoutMs)

}

export {
    getWholeNumber,
    getGoogleAuthorizationUrl,
    getAuthorizationCode,
    retryRequest

}

