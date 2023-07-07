
const cookieUtils = {
    getCookies() {
        const cookies = document.cookie.split("; ").reduce((result, v) => {
          const parts = v.split("=");
          const name = parts[0];
          const value = parts.slice(1).join("=");
          try {
            result[name] = JSON.parse(decodeURIComponent(value));
          } catch (error) {
            result[name] = value;
          }
          return result;
        }, {});
        return cookies;
      },
  
      setCookieValue(cookieName, value, expirationDate = "", domain = "") {
        const cookieValue = encodeURIComponent(JSON.stringify(value));
        let cookieString = `${cookieName}=${cookieValue};path=/`;
        if (expirationDate) {
          cookieString += `;expires=${expirationDate}`;
        }
        if (domain) {
          cookieString += `;domain=${domain}`;
        }
        document.cookie = cookieString;
      },
}

export default cookieUtils;