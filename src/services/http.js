import axios from "axios";

/**
 * The HTTP Service that communicates with the BodyTalks.PH API. It prepares,
 * processes, and wraps the necessary data before sending it to the API.
 * It also processes responses before sending it back to the caller.
 */
function HttpService() {
  /* Axios instance */
  const instance = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },

    withCredentials: true,
    timeout: 10000,
    responseType: "json",
    responseEncoding: "utf8",

    transformResponse: (data) => {
      data = JSON.parse(data);
      if (data?.error) data = data.error;
      return data;
    },

    validateStatus: (status) => {
      return status >= 200 && status < 300;
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
  const onLoginRequest = async (credentials) => {
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

  const onAuthSignoffRequest = async (userId) => {
    const requestConfig = {
      url: "/signoff",
      method: "POST",

      data: new URLSearchParams({ userId: userId }),
    };
    return instance(requestConfig);
  };

  const onReAuthRequest = async (userId, issuedAt) => {
    const requestConfig = {
      url: "/authenticate",
      method: "POST",

      data: new URLSearchParams({ userId: userId, iat: issuedAt }),
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

      data: new URLSearchParams({ userId: userId }),
    };

    return instance(requestConfig);
  };

  const onFetchData = async () => {
    const requestConfig = {
      url: "/load",
      method: "GET",
      params: { item_: "products" },
    };

    return instance(requestConfig);
  };

  const onPushData = async (data) => {
    const requestConfig = {
      url: "/add",
      method: "POST",
      params: { item_: "product" },

      data: new URLSearchParams({
        name: data.name,
        code: data.code,
        class: data.class,
        category: data.category,
        quantity: data.quantity,
        price: data.price,
        salePrice: data.salePrice,
      }),
    };

    return instance(requestConfig);
  };

  const onRemoveData = async (dataId) => {
    const requestConfig = {
      url: "/del",
      method: "DELETE",
      params: { item_: "product", _id: dataId },
    };

    return instance(requestConfig);
  };

  return {
    onLoginRequest,
    onAuthSignoffRequest,
    onReAuthRequest,
    onDatabasePing,
    onFetchUserData,
    onFetchData,
    onPushData,
    onRemoveData,
  };
}

export default HttpService;
