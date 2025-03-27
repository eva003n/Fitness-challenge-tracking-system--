const DB_NAME = "Fit-track";

const SOCKETEVENTENUM = Object.freeze({
  SOCKET_ERROR_EVENT: "socketError",
  CONNECTED_EVENT: "connect",
  DiSCONNECTED_EVENT: "disconnected",
  NOTIFY_EVENT: "notify",
  NOTIFICATION_READ_EVENT: "notificationRead",
  NOTIFY_REQUEST_EVENT: "notifyRequest",
  NEW_USER: "newUser",
  DISCONNETING: "disconnecting",
  DISCONNECT: "disconnect",
  TOKEN_EXPIRED: "tokenExpired",
  UPDATE_STREAK_DATE: "updateStreakDate",
  UPDATE_USER_STREAK: "streakUpdate"

});

export { DB_NAME, SOCKETEVENTENUM };
