import config from './config.js';
import abbreviationsUtil from './utils/abbreviations.js';
import dataStore from './store.js';
import dataFetchers from './fetchers.js';
const { abbreviations, sessionCookieName, firstVisitCookieName} = config;

const audubonTracker = (function () {

  const track = async () => {
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
      let sessionCount = 1;
      if (hasFirstVisitCookie && dataStore.firstVisitData.sc) {
        sessionCount = dataStore.firstVisitData.sc + 1;
      }
      const sessionData = {
        sessionCount: sessionCount,
        browser: dataFetchers.browser(),
        pagePath: dataFetchers.pagePath(),
        subdomain: dataFetchers.subdomain(),
        urlParams: dataFetchers.urlParams(),
        referrer: dataFetchers.referrer(),
        device: dataFetchers.device(),
        firstVisitDate: dataFetchers.firstVisitDate(),
        uniqueVisitorId: dataFetchers.uniqueVisitorId(),
      };

      dataStore.setFirstVisitData(sessionData);

      const ipAddress = await dataFetchers.ipAddress();
      if (ipAddress) {
        sessionData.ipAddress = ipAddress;
        dataStore.setSessionData(sessionData);
        dataStore.firstVisitData.ipAddress = ipAddress;
        dataStore.setFirstVisitData(dataStore.firstVisitData);
      }
    }
  };

  const getSession = variableName => {
    dataStore.initialize();
    const sessionData = dataStore.sessionData;
    const abbreviatedKey = abbreviations.keys[variableName] || variableName;
    const abbreviatedValue = sessionData[variableName] || sessionData[abbreviatedKey] || null;
    return abbreviationsUtil.unabbreviate(abbreviatedValue, variableName);
  };

  const getFirstVisit = variableName => {
    dataStore.initialize();
    const firstVisitData = dataStore.firstVisitData;
    const abbreviatedKey = abbreviations.keys[variableName] || variableName;
    const abbreviatedValue = firstVisitData[variableName] || firstVisitData[abbreviatedKey] || null;
    return abbreviationsUtil.unabbreviate(abbreviatedValue, variableName);
  };

  return {
    getSession,
    getFirstVisit,
    track,
  };
})();

window.audubonTracker = audubonTracker;
audubonTracker.track();
