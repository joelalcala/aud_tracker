const dataStore = require()

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

    uniqueVisitorId: function() {
      const firstVisitData = dataStore.firstVisitData;
      if (firstVisitData.uniqueVisitorId) {
        return firstVisitData.uniqueVisitorId;
      }
  
      // Combine the current time with a random string to form a unique ID
      const uniqueVisitorId = new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 16);
      return uniqueVisitorId;
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

    device: function() {
      const userAgent = navigator.userAgent;
      let device;
    
      if (userAgent.match(/Android/i)) device = "Android";
      else if (userAgent.match(/webOS/i)) device = "webOS";
      else if (userAgent.match(/iPhone/i)) device = "iPhone";
      else if (userAgent.match(/iPad/i)) device = "iPad";
      else if (userAgent.match(/iPod/i)) device = "iPod";
      else if (userAgent.match(/BlackBerry/i)) device = "BlackBerry";
      else if (userAgent.match(/Windows Phone/i)) device = "Windows Phone";
      else if (userAgent.match(/Macintosh/i)) device = "Mac"; // Checks for Mac desktop
      else if (userAgent.match(/Windows NT/i)) device = "Windows"; // Checks for Windows desktop
      else if (userAgent.match(/Linux/i)) device = "Linux"; // Checks for Linux desktop
      else device = "Unknown Device";
    
      return device;
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
  
  module.exports = dataFetchers;