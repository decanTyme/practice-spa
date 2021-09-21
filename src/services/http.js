import axios from "axios";

/**
 * The HTTP Service that communicates with the BodyTalks.PH API. It prepares,
 * processes, and wraps the necessary data before sending it to the API.
 * It also processes responses before sending it back to the caller.
 */
function HttpService() {
  /* Axios instance */
  const instance = axios.create({
    baseURL: "https://polar-wave-26304.herokuapp.com/api",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
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
      url: "/login",
      method: "POST",

      data: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
        grant_type: "password",
        rememberUser: credentials.rememberUser,
      }),
    };

    return instance(requestConfig);
  };

  const onAuthSignoffRequest = async (userId, refToken) => {
    const requestConfig = {
      url: "/signoff",
      method: "POST",

      data: new URLSearchParams({ userId, refToken }),
    };
    return instance(requestConfig);
  };

  const onReAuthRequest = async (userId, refToken) => {
    const data = refToken ? { userId, refToken } : { userId };

    const requestConfig = {
      url: "/authenticate",
      method: "POST",

      data: new URLSearchParams(data),
    };
    return instance(requestConfig);
  };

  const onDatabasePing = async () => {
    const requestConfig = {
      url: "/ping",
      method: "GET",
    };

    return instance(requestConfig);
  };

  const onFetchUserData = async (userId) => {
    const requestConfig = {
      url: "/user",
      method: "POST",

      data: new URLSearchParams(userId),
    };

    return instance(requestConfig);
  };

  const onDataFetch = async () => {
    const requestConfig = {
      url: "/load",
      method: "GET",
      params: { item_: "products" },
    };

    return instance(requestConfig);
  };

  const onDataPush = async (data) => {
    const requestConfig = {
      url: "/add",
      method: "POST",
      params: { item_: "product" },

      data: new URLSearchParams(data),
    };

    return instance(requestConfig);
  };

  const onDataModify = async (data) => {
    const requestConfig = {
      url: "/modify",
      method: "PATCH",
      params: { item_: "product" },

      data: new URLSearchParams(data),
    };

    return instance(requestConfig);
  };

  const onDataRemove = async (data) => {
    const requestConfig = {
      url: "/del",
      method: "DELETE",
      params: { _type: "product" },

      data: new URLSearchParams(data),
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
