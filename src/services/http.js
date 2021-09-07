function HttpService() {
  const API_URI = "https://polar-wave-26304.herokuapp.com/api";

  const login = async (credentials) => {
    return await fetch(API_URI + "/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password,
        grant_type: "password",
        rememberUser: credentials.rememberUser,
      }),
    })
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  const onAuthSignoffRequest = async (userId) => {
    return await fetch(API_URI + "/signoff", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({ userId: userId }),
    })
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  const onReAuthRequest = async (userId, issuedAt) => {
    return await fetch(API_URI + "/authenticate", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({ userId: userId, iat: issuedAt }),
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          let error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .catch((error) => {
        return error;
      });
  };

  const ping = async () => {
    return await fetch(API_URI + "/ping", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    })
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  const fetchUserData = async (userId) => {
    return await fetch(API_URI + "/user", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: new URLSearchParams({ userId: userId }),
    })
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  const fetchData = async () => {
    return await fetch(
      API_URI + "/load?" + new URLSearchParams({ item_: "products" }),
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  const pushData = async (data) => {
    return await fetch(
      API_URI + "/add?" + new URLSearchParams({ item_: "product" }),
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        body: new URLSearchParams({
          name: data.name,
          code: data.code,
          class: data.class,
          category: data.category,
          quantity: data.quantity,
          price: data.price,
          salePrice: data.salePrice,
        }),
      }
    )
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  const removeData = async (dataId) => {
    return await fetch(
      API_URI +
        "/del?" +
        new URLSearchParams({ item_: "product", _id: dataId }),
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
      }
    )
      .then((data) => {
        return data.json();
      })
      .catch((error) => {
        return { error: error };
      });
  };

  return {
    login,
    onAuthSignoffRequest,
    onReAuthRequest,
    ping,
    fetchUserData,
    fetchData,
    pushData,
    removeData,
  };
}

export default HttpService;
