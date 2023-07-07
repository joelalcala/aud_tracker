import abbreviationsUtil from "./utils/abbreviations";
import cookieUtils from "./utils/cookies";
import config from "./config";

const { domain, sessionCookieName, firstVisitCookieName, sessionExpiration } = config;

const dataStore = {
  initialized: false,
  cookies: null,
  sessionData: {},
  firstVisitData: {},

  initialize() {
    if (this.initialized) {
      return;
    }

    this.cookies = cookieUtils.getCookies();
    this.sessionData = this.cookies[sessionCookieName] || {};
    this.firstVisitData = this.cookies[firstVisitCookieName] || {};
    this.initialized = true;
  },

  getCookieValue(cookieName) {
    return this.cookies[cookieName] || null;
  },

  setSessionData(data) {
    this.initialize();
    this.sessionData = { ...this.sessionData, ...data };
    const abbreviatedData = abbreviationsUtil.getAbbreviatedData(this.sessionData);

    // Calculate the expiration date based on the sessionExpiration config value
    const expiration = new Date(Date.now() + (config.sessionExpiration * 60 * 1000));

    cookieUtils.setCookieValue(sessionCookieName, abbreviatedData, expiration.toUTCString(), domain);
  },

  setFirstVisitData(data) {
    this.initialize();
    this.firstVisitData = { ...this.firstVisitData, ...data };
    const abbreviatedData = abbreviationsUtil.getAbbreviatedData(this.firstVisitData);
    cookieUtils.setCookieValue(firstVisitCookieName, abbreviatedData, "Thu, 31 Dec 9999 23:59:59 GMT", domain);
  },

};

export default dataStore;
