const Constants = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  AuthManager: {
    Sign: {
      SIGNING_IN: "AUTH_SIGNING_IN",
      SIGNING_OFF: "AUTH_SIGNING_OFF",
      SIGNED_OFF: "AUTH_SIGNED_OFF",
      SIGNED_OFF_WITH_ERROR: "AUTH_SIGNED_OFF_FORCED",
      ERROR: "AUTH_ERROR",
      Token: {
        REFRESHING: "TOKEN_REFRESHING",
        REFRESH_SUCCESS: "TOKEN_REFRESH_SUCCESS",
        REFRESH_FAIL: "TOKEN_REFRESH_FAIL",
      },
    },
    Database: {
      CONNECTING: "DB_CONNECTING",
      CONNECTED: "DB_CONNECTED",
      ERROR: "DB_CONNECT_FAILED",
    },
  },
  DataService: {},
};

export default Constants;
