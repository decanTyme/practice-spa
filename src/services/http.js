import axios from "axios";

/**
 * The HTTP Service that communicates with the BodyTalks.PH API. It prepares,
 * processes, and wraps the necessary data before sending it to the API.
 * It also processes responses before sending it back to the caller.
 */
function HttpService() {
  /* Axios instance */
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },

    withCredentials: true,
    timeout: 10000,
    responseType: "json",
    responseEncoding: "utf8",

    transformResponse: (data) => {
      try {
        data = JSON.parse(data);
      } catch (error) {}
      if (data?.error) data = data.error;
      return data;
    },

    validateStatus: (status) => {
      return status >= 200;
    },
  });

  /**
   * Facilitates the wrapping of credentials to be sent to the API.
   *
   * @param  {Object} credentials
   *
   * @version 0.2.4
   * @since 0.0.9
   */
  const onAuthLoginRequest = async (credentials) => {
    const requestConfig = {
      url: "/auth/login",
      method: "POST",

      data: {
        username: credentials.username,
        password: credentials.password,
        grant_type: "password",
        rememberUser: credentials.rememberUser,
      },
    };

    return instance(requestConfig);
  };

  const onAuthSignoffRequest = async (userId, refToken) => {
    const requestConfig = {
      url: "/auth/signoff",
      method: "POST",

      data: { userId, refToken },
    };
    return instance(requestConfig);
  };

  const onReAuthRequest = async (userId, refToken) => {
    const data = refToken ? { userId, refToken } : { userId };

    const requestConfig = {
      url: "/auth/authenticate",
      method: "POST",

      data,
    };
    return instance(requestConfig);
  };

  const onDatabasePing = async () => {
    const requestConfig = {
      url: "/auth/ping",
      method: "GET",
    };

    return instance(requestConfig);
  };

  const onFetchUserData = async (userId) => {
    const requestConfig = {
      url: "/user",
      method: "POST",

      data: userId,
    };

    return instance(requestConfig);
  };

  const onDataFetch = async (type, opts = {}) => {
    const params = {};

    if (opts.populated) params.populate = true;

    const requestConfig = {
      url: `/${type}`,
      method: "GET",
      params,
    };

    return instance(requestConfig);
  };

  const onDataPush = async (type, data, { params = {} } = {}) => {
    const requestConfig = {
      url: `/${type}/add`,
      method: "POST",
      params,

      data,
    };

    return instance(requestConfig);
  };

  const onDataModify = async (
    type,
    data,
    { params = {}, endpoint = "modify" } = {}
  ) => {
    const requestConfig = {
      url: `/${type}/${endpoint}`,
      method: "PATCH",
      params,

      data,
    };

    return instance(requestConfig);
  };

  const onDataRemove = async (type, data, { params = {} } = {}) => {
    const requestConfig = {
      url: `/${type}/del`,
      method: "DELETE",
      params,

      data,
    };

    return instance(requestConfig);
  };

  return {
    onAuthLoginRequest,
    onAuthSignoffRequest,
    onReAuthRequest,
    onDatabasePing,
    onFetchUserData,
    onDataFetch,
    onDataPush,
    onDataModify,
    onDataRemove,
  };
}

export default HttpService;
