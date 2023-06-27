const audubonTracker = (function() {
  const ipifyUrl = "https://api.ipify.org?format=json";
  const sessionCookieName = "aud_sv";
  const firstVisitCookieName = "aud_fv";
  const domain = ".audubon.org";

  const abbreviations = {
    keys: {
      pagePath: "pp",
      subdomain: "sd",
      sessionCount: "sc",
      ipAddress: "ip",
      referrer: "ref",
      firstVisitDate: "fvd",
      cta: "cta",
      clickPath: "cp",
    },
    urlParams: {
      utm_source: "src",
      utm_medium: "med",
      utm_campaign: "cmp",
      utm_content: "cnt",
      utm_term: "trm",
      ms: "ms",
      aud_cta: "cta",
      aud_path: "path",
    },
    browser: {
      Chrome: "Ch",
      Firefox: "FF",
      Safari: "SF",
      Edge: "Ed",
      Opera: "Op",
      IE: "IE",
    },
    sources: {
      Google: "G",
      Facebook: "Fb",
      Twitter: "Tw",
      LinkedIn: "Li",
    },
    mediums: {
      email: "em",
      social: "so",
    },
  };

  const urlParamKeys = Object.keys(abbreviations.urlParams);

  const dataStore = {
    initialized: false,
    cookies: null,
    sessionData: {},
    firstVisitData: {},

    initialize() {
      if (this.initialized) {
        return;
      }

      this.cookies = this.getCookies();
      this.sessionData = this.cookies[sessionCookieName] || {};
      this.firstVisitData = this.cookies[firstVisitCookieName] || {};
      this.initialized = true;
    },

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

    getCookieValue(cookieName) {
      return this.cookies[cookieName] || null;
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

    setSessionData(data) {
      this.initialize();
      this.sessionData = { ...this.sessionData, ...data };
      const abbreviatedData = this.getAbbreviatedData(this.sessionData);
      this.setCookieValue(sessionCookieName, abbreviatedData, "", domain);
    },

    setFirstVisitData(data) {
      this.initialize();
      this.firstVisitData = { ...this.firstVisitData, ...data };
      const abbreviatedData = this.getAbbreviatedData(this.firstVisitData);
      this.setCookieValue(firstVisitCookieName, abbreviatedData, "Thu, 31 Dec 9999 23:59:59 GMT", domain);
    },

    getAbbreviatedData(data) {
      const abbreviatedData = {};
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== null) {
          const abbreviation = abbreviations.keys[key] || key;
    
          if (key === "urlParams") {
            const urlParams = data[key];
            const unabbreviatedUrlParams = {};
    
            for (const paramKey in urlParams) {
              if (abbreviations.urlParams[paramKey]) {
                unabbreviatedUrlParams[paramKey] = urlParams[paramKey];
              }
            }
    
            abbreviatedData[abbreviation] = unabbreviatedUrlParams;
          } else {
            abbreviatedData[abbreviation] = data[key];
          }
        }
      }
      return abbreviatedData;
    },

    getAbbreviatedValue(value) {
      for (const map of Object.values(abbreviations)) {
        const abbreviation = Object.keys(map).find(key => map[key] === value);
        if (abbreviation) {
          return abbreviation;
        }
      }
      return value;
    },
  };

  const dataFetchers = {
    browser: function() {
      if (dataStore.sessionData.browser) {
        return dataStore.sessionData.browser;
      }

      const userAgent = window.navigator.userAgent;
      const browserPatterns = [
        { name: "Chrome", pattern: /(Chrome|CriOS)\/([\d.]+)/ },
        { name: "Firefox", pattern: /(Firefox|FxiOS)\/([\d.]+)/ },
        { name: "Safari", pattern: /Version\/([\d.]+)(?=.*Safari)/ },
        { name: "Edge", pattern: /Edge\/([\d.]+)/ },
        { name: "Opera", pattern: /(Opera|OPR)\/([\d.]+)/ },
        { name: "IE", pattern: /(MSIE|Trident\/\d+.\d+|Edge\/\d+.\d+)/ },
      ];

      for (const { name, pattern } of browserPatterns) {
        const match = pattern.exec(userAgent);
        if (match) {
          return abbreviations.browser[name];
        }
      }

      return null;
    },

    pagePath: function() {
      if (dataStore.sessionData.pagePath) {
        return dataStore.sessionData.pagePath;
      }

      const pagePath = window.location.pathname;
      return pagePath;
    },

    subdomain: function() {
      if (dataStore.sessionData.subdomain) {
        return dataStore.sessionData.subdomain;
      }

      const subdomain = window.location.hostname.split(".")[0];
      return subdomain;
    },

    sessionCount: function() {
      const sessionData = dataStore.sessionData;
      if (sessionData.sessionCount) {
        return sessionData.sessionCount;
      }

      const sessionCount = (sessionData.sessionCount || 0) + 1;
      return sessionCount;
    },

    urlParams: function() {
      if (dataStore.sessionData.urlParams) {
        return dataStore.sessionData.urlParams;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const params = {};
      urlParamKeys.forEach(key => {
        const value = urlParams.get(key);
        if (value !== null) {
          params[key] = value;
        }
      });
      return params;
    },

    clickPath: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const clickPath = urlParams.get("aud_path") || null;
      return clickPath;
    },
    
    cta: function() {
      const urlParams = new URLSearchParams(window.location.search);
      const cta = urlParams.get("aud_cta") || null;
      return cta;
    },    
    
    ipAddress: async function() {
      if (dataStore.sessionData.ipAddress) {
        return dataStore.sessionData.ipAddress;
      }

      try {
        const response = await fetch(ipifyUrl);
        const data = await response.json();
        const ipAddress = data.ip;
        return ipAddress;
      } catch (error) {
        console.error("Error fetching IP address:", error);
        return null;
      }
    },

    referrer: function() {
      if (document.referrer) {
        return document.referrer;
      }
      return null;
    },

    firstVisitDate: function() {
      if (dataStore.sessionData.firstVisitDate) {
        return dataStore.sessionData.firstVisitDate;
      }

      const now = new Date();
      const firstVisitDate = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate()
      ).padStart(2, "0")}`;
      return firstVisitDate;
    },
  };

  const track = async function() {
    dataStore.initialize();
  
    const hasSessionCookie = dataStore.getCookieValue(sessionCookieName);
    const hasFirstVisitCookie = dataStore.getCookieValue(firstVisitCookieName);
  
    const clickPath = dataFetchers.clickPath();
    const cta = dataFetchers.cta();
  
    if (clickPath || cta) {
      const sessionData = {};
  
      if (clickPath) {
        sessionData.clickPath = clickPath;
      }
      if (cta) {
        sessionData.cta = cta;
      }
  
      dataStore.setSessionData(sessionData);
    }

    if (!hasSessionCookie) {
      const sessionData = {
        sessionCount: dataFetchers.sessionCount(),
        browser: dataFetchers.browser(),
        pagePath: dataFetchers.pagePath(),
        subdomain: dataFetchers.subdomain(),
        urlParams: dataFetchers.urlParams(),
        referrer: dataFetchers.referrer(),
      };
  
      if (!hasFirstVisitCookie) {
        sessionData.firstVisitDate = dataFetchers.firstVisitDate();
        dataStore.setFirstVisitData(sessionData);
      }
  
      const ipAddress = await dataFetchers.ipAddress();
      if (ipAddress) {
        sessionData.ipAddress = ipAddress;
      }
  
      dataStore.setSessionData(sessionData);
    }
  };
  
  

  const getSession = function(variableName) {
    dataStore.initialize();
    const sessionData = dataStore.sessionData;
    const abbreviatedKey = abbreviations.keys[variableName] || variableName;
    return sessionData[variableName] || sessionData[abbreviatedKey] || null;
  };
  
  const getFirstVisit = function(variableName) {
    dataStore.initialize();
    const firstVisitData = dataStore.firstVisitData;
    const abbreviatedKey = abbreviations.keys[variableName] || variableName;
    return firstVisitData[variableName] || firstVisitData[abbreviatedKey] || null;
  };
  

  return {
    getSession,
    getFirstVisit,
    track,
  };
})();

audubonTracker.track();
