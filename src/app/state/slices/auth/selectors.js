export const selectAuthCurrentState = (state) => state.root.AuthManager;

export const selectAuthState = (state) => state.root.AuthManager.isLoggedIn;

export const selectAuthAccess = (state) => state.root.AuthManager.access;

export const selectAuthStatus = (state) => state.root.AuthManager.status;

export const selectAuthRefToken = (state) => state.root.AuthManager.t_key;

export const selectAuthUserId = (state) => state.root.AuthManager.userId;

export const selectAuthUserData = (state) => state.root.AuthManager.userData;

export const selectAuthRememberUser = (state) =>
  state.root.AuthManager.rememberUser;

export const selectAuthDatabaseStatus = (state) =>
  state.root.AuthManager.database;

export const selectAuthStaleStatus = (state) => state.root.AuthManager.stale;
