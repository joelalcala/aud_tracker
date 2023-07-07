import config from './config.js';
import abbreviationsUtil from './utils/abbreviations.js';
import dataStore from './store.js';
import dataFetchers from './fetchers.js';
const { abbreviations } = config;
const hasSessionCookie = dataStore.hasSessionCookie();
const hasFirstVisitCookie = dataStore.hasFirstVisitCookie();

const audubonTracker = (function () {

  function getPerPageData() {
    const perPageData = {
      clickPath: dataFetchers.clickPath(),
      cta: dataFetchers.cta()
    };
    return perPageData;
  }

  function getPerSessionData() {
    const perSessionData = {
      browser: dataFetchers.browser(),
      pagePath: dataFetchers.pagePath(),
      subdomain: dataFetchers.subdomain(),
      urlParams: dataFetchers.urlParams(),
      referrer: dataFetchers.referrer(),
      device: dataFetchers.device(),
      uniqueVisitorId: dataFetchers.uniqueVisitorId(),
    }
    return perSessionData;
  }

  function getPerFirstVisitData() {
    const perFirstVisitData = {
      firstVisitDate: dataFetchers.firstVisitDate()
    }
    return perFirstVisitData;
  }

  function getSessionCount() {
    let sessionCount = 1;
    if (hasFirstVisitCookie && dataStore.firstVisitData.sc) {
      sessionCount = dataStore.firstVisitData.sc + 1;
    }
    return sessionCount;
  }

  const track = async () => {
    dataStore.initialize();

    let perSessionData = {}
    let perFirstVisitData = {}

    // Set data collected on each page
    let perPageData = getPerPageData();
    const { clickPath, cta } = perPageData;
    if (clickPath || cta) {
      dataStore.setSessionData(perPageData);
    }


    if (!hasSessionCookie) {
      const sessionCount = getSessionCount();
      perSessionData.sessionCount = sessionCount;
      perSessionData = {...getPerSessionData(), ...perSessionData};
      dataStore.setSessionData(perSessionData);

      if (!hasFirstVisitCookie) {
        perFirstVisitData = {...getPerFirstVisitData(), ...perSessionData};
        dataStore.setFirstVisitData(perFirstVisitData);
      } else{
        perFirstVisitData = dataStore.firstVisitData;
        perFirstVisitData.sessionCount = sessionCount;
        dataStore.setFirstVisitData(perFirstVisitData);
      }

      const ipAddress = await dataFetchers.ipAddress();
      if (ipAddress) {
        perSessionData.ipAddress = ipAddress;
        dataStore.setSessionData(perSessionData);

        if (!hasFirstVisitCookie) {
          perFirstVisitData.ipAddress = ipAddress;
          dataStore.setFirstVisitData(perFirstVisitData);
        }

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
