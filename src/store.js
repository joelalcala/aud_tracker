import abbreviationsUtils from './utils/abbreviations';
import cookieUtils from './utils/cookies';
import localStorageUtils from './utils/localStorage';
import config from './config';

const { domain, sessionCookieName, firstVisitCookieName, sessionExpiration } = config;

const dataStore = {
  initialized: false,
  cookies: null,
  sessionData: {},
  firstVisitData: {},
  pageViewData: {},
  profileData: {},
  hasFirstVisitCookie: null,
  hasSessionCookie: null,

  initialize() {
    if (this.initialized) {
      return;
    }

    this.cookies = cookieUtils.getCookies() ?? {};
    this.hasFirstVisitCookie = this.cookies[firstVisitCookieName] ? true : false;
    this.hasSessionCookie = this.cookies[sessionCookieName] ? true : false;

    if (this.hasSessionCookie) {
      this.sessionData = abbreviationsUtils.unabbreviateObject(this.cookies[sessionCookieName]);
    } else {
      this.sessionData = {};
    }

    if (this.hasFirstVisitCookie) {
      this.firstVisitData = abbreviationsUtils.unabbreviateObject(this.cookies[firstVisitCookieName]);
    } else {
      this.firstVisitData = {};
    }

    this.profileData = localStorageUtils.get('aud_pro') || {};
    this.initialized = true;
  },

  getCookieValue(cookieName) {
    return this.cookies[cookieName] || null;
  },

  setSessionData(data) {
    this.initialize();
    const unabbreviatedData = abbreviationsUtils.unabbreviateObject(data);
    this.sessionData = { ...this.sessionData, ...unabbreviatedData };

    // Calculate the expiration date based on the sessionExpiration config value
    const expiration = new Date(Date.now() + sessionExpiration * 60 * 1000);

    cookieUtils.setCookieValue(
      sessionCookieName,
      abbreviationsUtils.abbreviateObject(this.sessionData),
      expiration.toUTCString(),
      domain
    );
  },

  setFirstVisitData(data) {
    this.initialize();
    const unabbreviatedData = abbreviationsUtils.unabbreviateObject(data);
    this.firstVisitData = { ...this.firstVisitData, ...unabbreviatedData };

    cookieUtils.setCookieValue(
      firstVisitCookieName,
      abbreviationsUtils.abbreviateObject(this.firstVisitData),
      'Thu, 31 Dec 9999 23:59:59 GMT',
      domain
    );
  },

  setPageViewData(data) {
    this.initialize();
    this.pageViewData = { ...this.pageViewData, ...data };
  },

  setProfileData(data) {
    this.initialize();
    this.profileData = { ...this.profileData, ...data };
    localStorageUtils.set('aud_pro', this.profileData);
  },

  getSessionValue(variableName) {
    this.initialize();
    return this.sessionData[variableName] || null;
  },

  getFirstVisitValue(variableName) {
    this.initialize();
    return this.firstVisitData[variableName] || null;
  },
};

export default dataStore;
