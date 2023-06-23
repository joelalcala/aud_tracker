(function() {
  const audubonTracker = (() => {
    const specificUrlParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ms', 'aud_cta', 'aud_path'];
    const propertyAbbreviations = {
      browser: 'br',
      device: 'dev',
      pagePath: 'pp',
      subdomain: 'sub',
      referrer: 'ref',
      parameters: 'param',
      ip: 'ip',
      cta: 'cta',
      firstVisitDate: 'fv',
      clickPath: 'cp',
      sessionCount: 'sc'
    };

    let sessionData = null;
    let firstVisitData = null;

    const createCookie = (name, value, days) => {
      const encodedValue = encodeURIComponent(value);
      const existingCookie = readCookie(name);

      if (existingCookie !== encodedValue) {
        let expires = "";
        if (days) {
          const date = new Date();
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = "; expires=" + date.toUTCString();
        }
        try {
          document.cookie = name + "=" + encodedValue + expires + "; path=/; domain=.audubon.org";
        } catch (error) {
          console.error('Error setting cookie:', error);
        }
      }
    };

    const readCookie = (name) => {
      try {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i];
          while (c.charAt(0) === ' ') c = c.substring(1, c.length);
          if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
        return null;
      } catch (error) {
        console.error('Error reading cookie:', error);
        return null;
      }
    };

    const getParameters = (urlParams, paramList) => {
      return paramList.reduce((acc, param) => {
        if (urlParams.has(param)) {
          const key = param.startsWith('utm_') ? param.substring(4) : param;
          acc[key] = urlParams.get(param);
        }
        return acc;
      }, {});
    };

    const getUserIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
      } catch (error) {
        console.error('Error fetching user IP:', error);
        return null;
      }
    };

    const getBrowserInfo = () => {
      const userAgent = navigator.userAgent;
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      let browser = '';

      if (userAgent.indexOf('Chrome') > -1) {
        browser = `Chrome (${screenResolution})`;
      } else if (userAgent.indexOf('Safari') > -1) {
        browser = `Safari (${screenResolution})`;
      } else if (userAgent.indexOf('Firefox') > -1) {
        browser = `Firefox (${screenResolution})`;
      } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) {
        browser = `IE (${screenResolution})`;
      } else if (userAgent.indexOf('Edge') > -1) {
        browser = `Edge (${screenResolution})`;
      } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
        browser = `Opera (${screenResolution})`;
      }

      return browser;
    };

    const urlParams = new URLSearchParams(window && window.location ? window.location.search : '');

    let userInfo = {
      [propertyAbbreviations.browser]: getBrowserInfo(),
      [propertyAbbreviations.device]: navigator && navigator.platform ? navigator.platform : '',
      [propertyAbbreviations.pagePath]: window && window.location ? window.location.pathname : '',
      [propertyAbbreviations.subdomain]: window && window.location ? window.location.hostname.split('.')[0] : '',
      [propertyAbbreviations.referrer]: document && document.referrer ? document.referrer : '',
      [propertyAbbreviations.parameters]: getParameters(urlParams, specificUrlParams)
    };

    if (userInfo[propertyAbbreviations.subdomain] === 'act' && urlParams.has('aud_cta')) {
      userInfo[propertyAbbreviations.cta] = urlParams.get('aud_cta');
    }

    if (userInfo[propertyAbbreviations.subdomain] === 'act' && urlParams.has('aud_path')) {
      userInfo[propertyAbbreviations.clickPath] = urlParams.get('aud_path');
    }

    const track = async () => {
      if (!sessionData) {
        const sessionCookie = readCookie('aud_sv');
        sessionData = sessionCookie ? JSON.parse(sessionCookie) : null;
      }

      if (!firstVisitData) {
        const firstVisitCookie = readCookie('aud_fv');
        firstVisitData = firstVisitCookie ? JSON.parse(firstVisitCookie) : null;
      }

      if (!sessionData || !firstVisitData) {
        userInfo[propertyAbbreviations.ip] = await getUserIP();
      }

      if (!sessionData) {
        sessionData = {
          ...userInfo,
          [propertyAbbreviations.sessionCount]: 0
        };
      }

      if (!firstVisitData) {
        firstVisitData = {
          ...userInfo,
          [propertyAbbreviations.sessionCount]: 0,
          [propertyAbbreviations.firstVisitDate]: new Date().toISOString()
        };
      }

      firstVisitData[propertyAbbreviations.sessionCount]++;
      sessionData[propertyAbbreviations.sessionCount] = firstVisitData[propertyAbbreviations.sessionCount];

      createCookie('aud_sv', JSON.stringify(sessionData));
      createCookie('aud_fv', JSON.stringify(firstVisitData), 365 * 10);
    };

    const getSession = (variable) => {
      const unabbreviatedVariable = propertyAbbreviations[variable] || variable;
      if (sessionData && unabbreviatedVariable in sessionData) {
        return sessionData[unabbreviatedVariable];
      }
      console.error(`Variable '${variable}' not found in the session data.`);
      return null;
    };

    const getFirstVisit = (variable) => {
      const unabbreviatedVariable = propertyAbbreviations[variable] || variable;
      if (firstVisitData && unabbreviatedVariable in firstVisitData) {
        return firstVisitData[unabbreviatedVariable];
      }
      console.error(`Variable '${variable}' not found in the first visit data.`);
      return null;
    };

    // Define the version of the tracking script
    const version = '1.0.0';

    return {
      track,
      getSession,
      getFirstVisit,
      version
    };
  })();

  window.audubonTracker = audubonTracker;

  audubonTracker.track();
})();
