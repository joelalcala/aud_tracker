import dataStore from './store.js';
import dataFetchers from './fetchers.js';

const audubonTracker = (function () {

  console.log("dataStore: ", dataStore);

  const getSession = (variableName) => {
    return dataStore.getSessionValue(variableName);
  };

  const getFirstVisit = (variableName) => {
    return dataStore.getFirstVisitValue(variableName);
  };

  function getLastSeenData() {
    const lastSeenData = {
      clickPath: dataFetchers.clickPath(),
      cta: dataFetchers.cta(),
    };
    return lastSeenData;
  }

  function getPerPageData() {
    const perPageData = {
      pageCount: dataFetchers.pageCount(),
      pagePath: dataFetchers.pagePath(),
    };
    return perPageData;
  }

  function getPerSessionData() {
    const perSessionData = {
      browser: dataFetchers.browser(),
      landingPage: dataFetchers.pagePath(),
      subdomain: dataFetchers.subdomain(),
      referrer: dataFetchers.referrer(),
      device: dataFetchers.device(),
      ...dataFetchers.urlParams(),
    }
    return perSessionData;
  }

  function getPerFirstVisitData() {
    const perFirstVisitData = {
      firstVisitDate: dataFetchers.firstVisitDate(),
      uniqueVisitorId: dataFetchers.uniqueVisitorId(),
    }
    return perFirstVisitData;
  }

  function processProfileData() {
    console.log("processing data");
  
    const { sessionData, firstVisitData, pageViewData, profileData } = dataStore;
    let updatedProfileData = profileData;
  
    if (firstVisitData.uvid) {
      updatedProfileData.uniqueVisitorId = firstVisitData.uvid;
    }
  
    // if (sessionData.up.med === "social") {
    //   updatedProfileData.social = true;
    // }
  
    // if (sessionData.up.med === "email") {
    //   updatedProfileData.email = true;
    // }
  
    if (pageViewData.pagePath && pageViewData.pagePath.startsWith("/field-guide/bird/")) {
      updatedProfileData.birdsVisited = updatedProfileData.birdsVisited || [];
      const slug = pageViewData.pagePath.split("/").pop();
      
      if (!updatedProfileData.birdsVisited.includes(slug)) {
        updatedProfileData.birdsVisited.push(slug);
      }
    }
  
    console.log("profileData", updatedProfileData);
    return updatedProfileData;
  }  


  const track = async () => {
    dataStore.initialize();
    const { hasFirstVisitCookie, hasSessionCookie } = dataStore;
    let perSessionData = {}
    let perFirstVisitData = {}
    let perPageData = {}
    let lastSeenData = {}

    lastSeenData = getLastSeenData();
    const { clickPath, cta } = lastSeenData;
    if (clickPath || cta) {
      dataStore.setSessionData({ ...dataStore.sessionData, clickPath, cta });
    }
    
    perPageData = getPerPageData();
    const { pageCount } = perPageData;
    dataStore.setFirstVisitData({ ...dataStore.firstVisitData, pageCount});
    dataStore.setPageViewData(perPageData);

    if (!hasSessionCookie) {
      const sessionCount = dataFetchers.sessionCount();
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

    console.log("about to process data");

    let profileData = processProfileData();
    dataStore.setProfileData(profileData);

  };

  return {
    getSession,
    getFirstVisit,
    track,
  };
})();

window.audubonTracker = audubonTracker;
audubonTracker.track();
