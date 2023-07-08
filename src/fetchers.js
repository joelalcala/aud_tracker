import config from "./config";
import dataStore from "./store";
const { abbreviations } = config;
const urlParamKeys = Object.keys(abbreviations.urlParams);
const ipifyUrl = "https://api.ipify.org?format=json";

const dataFetchers = {
    browser: () => {
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

    pagePath: () => {
      if (dataStore.sessionData.pagePath) {
        return dataStore.sessionData.pagePath;
      }

      const pagePath = window.location.pathname;
      return pagePath;
    },

    subdomain: () => {
      if (dataStore.sessionData.subdomain) {
        return dataStore.sessionData.subdomain;
      }

      const subdomain = window.location.hostname.split(".")[0];
      return subdomain;
    },

    sessionCount: () => {
      let sessionCount = 1;
      if (dataStore.hasFirstVisitCookie && dataStore.firstVisitData.sc) {
        sessionCount = dataStore.firstVisitData.sc + 1;
      }
      return sessionCount;
    },

    pageCount: () => {
      let pageCount = dataStore.firstVisitData.pc || 0;
      pageCount += 1;
      return pageCount;
    },

    urlParams: () => {
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

    clickPath: () => {
      const urlParams = new URLSearchParams(window.location.search);
      const clickPath = urlParams.get("aud_path") || null;
      return clickPath;
    },

    cta: () => {
      const urlParams = new URLSearchParams(window.location.search);
      const cta = urlParams.get("aud_cta") || null;
      return cta;
    },

    uniqueVisitorId: () => {
      const firstVisitData = dataStore.firstVisitData;
      if (firstVisitData.uniqueVisitorId) {
        return firstVisitData.uniqueVisitorId;
      }

      const uniqueVisitorId =
        new Date().getTime().toString(36) + Math.random().toString(36).substr(2, 16);
      return uniqueVisitorId;
    },

    ipAddress: async () => {
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

    referrer: () => {
      if (document.referrer) {
        return document.referrer;
      }
      return null;
    },

    device: () => {
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

    firstVisitDate: () => {
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

  export default dataFetchers;