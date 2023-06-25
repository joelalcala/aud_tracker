const audubonTracker = (function() {
  const ipifyUrl = "https://api.ipify.org?format=json";

  const abbreviations = {
    browser: {
      Chrome: "Ch",
      Firefox: "Ff",
      Safari: "Sf",
      Edge: "Ed",
      Opera: "Op",
      IE: "IE",
    },
    medium: {
      email: "em",
      social: "so",
    },
    source: {
      facebook: "Fb",
      twitter: "Tw",
      instagram: "Ig",
      linkedin: "Ln",
      youtube: "Yt",
    },
    urlParams: {
      utm_source: "us",
      utm_medium: "um",
      utm_campaign: "uc",
      utm_content: "uct",
      utm_term: "ut",
      ms: "ms",
    },
    keys: {
      browser: "br",
      pagePath: "pp",
      subdomain: "sd",
      sessionCount: "sc",
      urlParams: "up",
      cta: "ca",
      clickPath: "cp",
      ipAddress: "ip",
      firstVisitDate: "fv",
      referrer: "rf",
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
      this.sessionData = this.cookies["aud_sv"] || {};
      this.firstVisitData = this.cookies["aud_fv"] || {};
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

    setCookieValue(cookieName, value, expirationDate = "") {
      const cookieValue = encodeURIComponent(JSON.stringify(value));
      let cookieString = `${cookieName}=${cookieValue};path=/`;
      if (expirationDate) {
        cookieString += `;expires=${expirationDate}`;
      }
      document.cookie = cookieString;
    },

    getAbbreviatedValue(key, value) {
      const abbreviationMap = abbreviations[key] || {};
      return abbreviationMap[value] || value;
    },

    getAbbreviatedData(data) {
      const abbreviatedData = {};
      for (const key in data) {
        if (data[key] !== null) {
          const abbreviatedKey = abbreviations.keys[key] || key;

          if (key === "urlParams") {
            const urlParams = data[key];
            const abbreviatedUrlParams = {};

            for (const paramKey in urlParams) {
              const value = urlParams[paramKey];
              const abbreviation = abbreviations.urlParams[paramKey] || paramKey;
              abbreviatedUrlParams[abbreviation] = this.getAbbreviatedValue("source", value);
            }

            abbreviatedData[abbreviatedKey] = abbreviatedUrlParams;
          } else {
            abbreviatedData[abbreviatedKey] = this.getAbbreviatedValue(key, data[key]);
          }
        }
      }
      return abbreviatedData;
    },

    getSessionData() {
      this.initialize();
      return this.sessionData;
    },

    setSessionData(data) {
      this.initialize();
      const updatedData = { ...this.sessionData, ...data };
      this.sessionData = updatedData;
      const abbreviatedData = this.getAbbreviatedData(updatedData);
      this.setCookieValue("aud_sv", abbreviatedData);
    },

    getFirstVisitData() {
      this.initialize();
      return this.firstVisitData;
    },

    setFirstVisitData(data) {
      this.initialize();
      const updatedData = { ...this.firstVisitData, ...data };
      this.firstVisitData = updatedData;
      const abbreviatedData = this.getAbbreviatedData(updatedData);
      this.setCookieValue("aud_fv", abbreviatedData, "Thu, 31 Dec 9999 23:59:59 GMT");
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
          dataStore.setSessionData({ browser: name });
          return name;
        }
      }

      return null;
    },

    pagePath: function() {
      if (dataStore.sessionData.pagePath) {
        return dataStore.sessionData.pagePath;
      }

      const pagePath = window.location.pathname;
      dataStore.setSessionData({ pagePath });
      return pagePath;
    },

    subdomain: function() {
      if (dataStore.sessionData.subdomain) {
        return dataStore.sessionData.subdomain;
      }

      const subdomain = window.location.hostname.split(".")[0];
      dataStore.setSessionData({ subdomain });
      return subdomain;
    },

    sessionCount: function() {
      if (dataStore.sessionData.sessionCount) {
        return dataStore.sessionData.sessionCount;
      }

      const sessionCount = (dataStore.sessionData.sessionCount || 0) + 1;
      dataStore.setSessionData({ sessionCount });
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

      if (Object.keys(params).length > 0) {
        dataStore.setSessionData({ urlParams: params });
      }

      return params;
    },

    cta: function() {
      if (dataStore.sessionData.cta !== undefined) {
        return dataStore.sessionData.cta;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const subdomain = window.location.hostname.split(".")[0];
      const ctaValue = (subdomain === "act" && urlParams.get("aud_cta")) || null;
      dataStore.setSessionData({ cta: ctaValue });
      return ctaValue;
    },

    clickPath: function() {
      if (dataStore.sessionData.clickPath !== undefined) {
        return dataStore.sessionData.clickPath;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const subdomain = window.location.hostname.split(".")[0];
      const clickPathValue = (subdomain === "act" && urlParams.get("aud_path")) || null;
      dataStore.setSessionData({ clickPath: clickPathValue });
      return clickPathValue;
    },

    ipAddress: async function() {
      const sessionData = dataStore.getSessionData();
      const storedIPAddress = sessionData.ipAddress;
      if (storedIPAddress) {
        return storedIPAddress;
      }

      try {
        const response = await fetch(ipifyUrl);
        const data = await response.json();
        const ipAddress = data.ip;
        dataStore.setSessionData({ ipAddress });
        return ipAddress;
      } catch (error) {
        console.error("Failed to fetch IP address:", error);
        return null;
      }
    },

    referrer: function() {
      if (dataStore.sessionData.referrer) {
        return dataStore.sessionData.referrer;
      }

      const referrer = document.referrer || null;
      dataStore.setSessionData({ referrer });
      return referrer;
    },

    firstVisitDate: function() {
      const firstVisitData = dataStore.getFirstVisitData();
      const firstVisitDate = firstVisitData.firstVisitDate;
      if (!firstVisitDate) {
        const now = new Date();
        const formattedDate = now
          .toLocaleDateString("en-US", {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })
          .replace(/\//g, "");
        dataStore.setFirstVisitData({ firstVisitDate: formattedDate });
        return formattedDate;
      }
      return firstVisitDate;
    },
  };

  const track = function() {
    const sessionData = {
      sessionCount: dataFetchers.sessionCount(),
      browser: dataFetchers.browser(),
      pagePath: dataFetchers.pagePath(),
      subdomain: dataFetchers.subdomain(),
      urlParams: dataFetchers.urlParams(),
      cta: dataFetchers.cta(),
      clickPath: dataFetchers.clickPath(),
      ipAddress: dataFetchers.ipAddress(),
      referrer: dataFetchers.referrer(),
      firstVisitDate: dataFetchers.firstVisitDate(),
    };

    const abbreviatedSessionData = dataStore.getAbbreviatedData(sessionData);
    dataStore.setSessionData(abbreviatedSessionData);

    if (!dataStore.getFirstVisitData().sessionCount) {
      dataStore.setFirstVisitData(abbreviatedSessionData);
    }
  };

  return {
    getSession: function(varName) {
      const sessionData = dataStore.getSessionData();
      const cookieData = sessionData[varName] || null;
      if (!cookieData) {
        console.error("Requested variable not found in session data");
      }
      return cookieData;
    },

    getFirstVisit: function(varName) {
      const firstVisitData = dataStore.getFirstVisitData();
      const cookieData = firstVisitData[varName] || null;
      if (!cookieData) {
        console.error("Requested variable not found in first visit data");
      }
      return cookieData;
    },

    track: function() {
      track();
    },
  };
})();

audubonTracker.track();
