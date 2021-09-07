function cookieMaster() {
  const getCookie = (type) => {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      if (type === cookiePair[0].trim()) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    return null;
  };

  const giveCookie = (type, val, opts) => {
    let cookie, expiry;

    cookie = `${type}=${val};`;

    try {
      if (opts["expiresIn"]) {
        expiry = new Date(opts.expiresIn * 1000).toUTCString();
        cookie += `expires=${expiry};`;
      }
    } catch (e) {}

    document.cookie = cookie;
  };

  const removeCookie = (type) => {
    document.cookie = `${type}= ; expires= Thu, 01 Jan 1970 00:00:00 GMT;`;
  };

  const clearCookies = () => {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      removeCookie(cookiePair[0]);
    }
  };

  return { getCookie, giveCookie, removeCookie, clearCookies };
}

export default cookieMaster;
