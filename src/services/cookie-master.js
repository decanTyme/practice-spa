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

  const appendCookie = (type, val) => {
    document.cookie = `${type}=${val};`;
  };

  const deleteCookie = (type) => {
    document.cookie = `${type}= ; expires= Thu, 01 Jan 1970 00:00:00 GMT;`;
  };

  const clearCookies = () => {
    let cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
      let cookiePair = cookieArr[i].split("=");
      deleteCookie(cookiePair[0]);
    }
  };

  return {
    getCookie: getCookie,
    appendCookie: appendCookie,
    deleteCookie: deleteCookie,
    clearCookies: clearCookies,
  };
}

export default cookieMaster;
