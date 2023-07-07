const config = {
    abbreviations: {
      keys: {
        pagePath: "pp",
        subdomain: "sd",
        sessionCount: "sc",
        ipAddress: "ip",
        referrer: "ref",
        firstVisitDate: "fvd",
        cta: "cta",
        clickPath: "cp",
        uniqueVisitorId: "uvid",
        browser: "br",
        device: "dv",
        urlParams: "up",
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
        google: "G",
        facebook: "Fb",
        twitter: "Tw",
        LinkedIn: "Li",
      },
      mediums: {
        email: "em",
        social: "so",
      },
    },
    domain: ".audubon.org",
    sessionCookieName: "aud_sv",
    firstVisitCookieName: "aud_fv",
    sessionExpiration: 30, // in minutes
  };
  
  export default config;
  