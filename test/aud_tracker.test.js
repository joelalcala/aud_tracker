const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const aud_tracker = fs.readFileSync(path.resolve(__dirname, '../dist/aud_tracker.min.js'), 'utf8');

const NAS_PAGE = 'https://www.audubon.org/field-guide/bird/magnificent-frigatebird?ms=digital-eng-social-facebook-x-20230600-nas_eng&utm_source=facebook&utm_medium=social&utm_campaign=20230600_nas_eng';
const EA_PAGE = 'https://act.audubon.org/a/donate?ms=digital-fund-web-website_nas-topmenu_donate_20200800&aud_path=/field-guide/bird/magnificent-frigatebird&aud_cta=nav';
const MULTI_SESSION_PAGE = 'https://rockies.audubon.org/';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36';
const REFERRER = 'https://www.google.com/';

describe('Audubon Tracker', () => {
  let browser, page;
  const todayDate = `${new Date().getFullYear().toString().substr(-2)}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`;

  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: "new" });
    page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.setExtraHTTPHeaders({
      'Referer': REFERRER
    });
  });

  afterAll(async () => {
    browser.close();
  });

  describe('NAS page', () => {
    beforeAll(async () => {
      await page.goto(NAS_PAGE);
      await page.evaluate(aud_tracker);
      await page.waitForFunction('audubonTracker.getSession("ipAddress") !== null');
    });

    test('Cookies are created and have correct scope', async () => {
      const aud_sv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_sv'));
      const aud_fv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_fv'));
      expect(aud_sv).toBeTruthy();
      expect(aud_fv).toBeTruthy();
      expect(aud_sv.domain).toBe('.audubon.org');
      expect(aud_fv.domain).toBe('.audubon.org');
    });

    test('landingPage is correct', async () => {
      const svLandingPage = await page.evaluate('audubonTracker.getSession("landingPage")');
      const fvLandingPage = await page.evaluate('audubonTracker.getFirstVisit("landingPage")');
      expect(svLandingPage).toBe('/field-guide/bird/magnificent-frigatebird');
      expect(fvLandingPage).toBe('/field-guide/bird/magnificent-frigatebird');
    });

    test('subdomain is correct', async () => {
      const svSubdomain = await page.evaluate('audubonTracker.getSession("subdomain")');
      const fvSubdomain = await page.evaluate('audubonTracker.getFirstVisit("subdomain")');
      expect(svSubdomain).toBe('www');
      expect(fvSubdomain).toBe('www');
    });

    test('sessionCount is correct', async () => {
      const fvSessionCount = await page.evaluate('audubonTracker.getFirstVisit("sessionCount")');
      expect(fvSessionCount).toBe(1);
    });

    test('utm_source is correct', async () => {
      const fvUtmSource = await page.evaluate('audubonTracker.getFirstVisit("utm_source")');
      const svUtmSource = await page.evaluate('audubonTracker.getSession("utm_source")');
      expect(fvUtmSource).toBe('facebook');
      expect(svUtmSource).toBe('facebook');
    });
    
    test('utm_medium is correct', async () => {
      const fvUtmMedium = await page.evaluate('audubonTracker.getFirstVisit("utm_medium")');
      const svUtmMedium = await page.evaluate('audubonTracker.getSession("utm_medium")');
      expect(fvUtmMedium).toBe('social');
      expect(svUtmMedium).toBe('social');
    });
    
    test('utm_campaign is correct', async () => {
      const fvUtmCampaign = await page.evaluate('audubonTracker.getFirstVisit("utm_campaign")');
      const svUtmCampaign = await page.evaluate('audubonTracker.getSession("utm_campaign")');
      expect(fvUtmCampaign).toBe('20230600_nas_eng');
      expect(svUtmCampaign).toBe('20230600_nas_eng');
    });

    test('ms is correct', async () => {
      const fvMs = await page.evaluate('audubonTracker.getFirstVisit("ms")');
      const svMs = await page.evaluate('audubonTracker.getSession("ms")');
      expect(fvMs).toBe('digital-eng-social-facebook-x-20230600-nas_eng');
      expect(svMs).toBe('digital-eng-social-facebook-x-20230600-nas_eng');

    });

    test('firstVisitDate is correct', async () => {
      const firstVisitDate = await page.evaluate('audubonTracker.getFirstVisit("firstVisitDate")');
      expect(firstVisitDate).toBe(todayDate);
    });

    test('ipAddress is present', async () => {
      const fvIpAddress = await page.evaluate('audubonTracker.getFirstVisit("ipAddress")');
      const svIpAddress = await page.evaluate('audubonTracker.getSession("ipAddress")');
      expect(fvIpAddress).toBeTruthy();
      expect(svIpAddress).toBeTruthy();
    });

    test('browser is correct', async () => {
      const fvBrowser = await page.evaluate('audubonTracker.getFirstVisit("browser")');
      const svBrowser = await page.evaluate('audubonTracker.getSession("browser")');
      expect(fvBrowser).toBe('Chrome');
      expect(svBrowser).toBe('Chrome');
    });

    test('referrer is correct', async () => {
      const fvReferrer = await page.evaluate('audubonTracker.getFirstVisit("referrer")');
      const svReferrer = await page.evaluate('audubonTracker.getSession("referrer")');
      expect(fvReferrer).toBe(REFERRER);
      expect(svReferrer).toBe(REFERRER);
    });

    test('uniqueVisitorId is present', async () => {
      const uniqueVisitorId = await page.evaluate('audubonTracker.getFirstVisit("uniqueVisitorId")');
      expect(uniqueVisitorId).toBeTruthy();
    });

  });

  describe('EA page', () => {
    beforeAll(async () => {
      await page.goto(EA_PAGE);
      await page.evaluate(aud_tracker);
      await page.waitForFunction('audubonTracker.getSession("ipAddress") !== undefined');
    });

    afterAll(async () => {
      let cookies = await page.cookies();
      for (let cookie of cookies) {
        if(cookie.name == 'aud_sv') {
          await page.deleteCookie(cookie);
        }
      }
    });

    test('Cookies are still available and have correct scope', async () => {
      const aud_sv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_sv'));
      const aud_fv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_fv'));
      expect(aud_sv).toBeTruthy();
      expect(aud_fv).toBeTruthy();
      expect(aud_sv.domain).toBe('.audubon.org');
      expect(aud_fv.domain).toBe('.audubon.org');
    });

    test('landingPage has not been overwritten', async () => {
      const landingPage = await page.evaluate('audubonTracker.getSession("landingPage")');
      expect(landingPage).toBe('/field-guide/bird/magnificent-frigatebird');
    });

    test('subdomain has not been overwritten', async () => {
      const subdomain = await page.evaluate('audubonTracker.getSession("subdomain")');
      expect(subdomain).toBe('www');
    });

    test('sessionCount has not been overwritten', async () => {
      const sessionCount = await page.evaluate('audubonTracker.getFirstVisit("sessionCount")');
      expect(sessionCount).toBe(1);
    });

    test('utm_source has not been overwritten', async () => {
      const utmSource = await page.evaluate('audubonTracker.getSession("utm_source")');
      expect(utmSource).toBe('facebook');
    });

    test('utm_medium has not been overwritten', async () => {
      const utmMedium = await page.evaluate('audubonTracker.getSession("utm_medium")');
      expect(utmMedium).toBe('social');
    });

    test('utm_campaign has not been overwritten', async () => {
      const utmCampaign = await page.evaluate('audubonTracker.getSession("utm_campaign")');
      expect(utmCampaign).toBe('20230600_nas_eng');
    });

    test('ms has not been overwritten', async () => {
      const ms = await page.evaluate('audubonTracker.getSession("ms")');
      expect(ms).toBe('digital-eng-social-facebook-x-20230600-nas_eng');
    });

    test('firstVisitDate has not been overwritten', async () => {
      const firstVisitDate = await page.evaluate('audubonTracker.getFirstVisit("firstVisitDate")');
      expect(firstVisitDate).toBe(todayDate);
    });

    test('ipAddress has not been overwritten', async () => {
      const ipAddress = await page.evaluate('audubonTracker.getSession("ipAddress")');
      expect(ipAddress).toBeTruthy();
    });

    test('Click path is correct', async () => {
      const clickPath = await page.evaluate('audubonTracker.getSession("clickPath")');
      expect(clickPath).toBe('/field-guide/bird/magnificent-frigatebird');
    });

    test('CTA is correct', async () => {
      const cta = await page.evaluate('audubonTracker.getSession("cta")');
      expect(cta).toBe('nav');
    });

    test('uniqueVisitorId is still available', async () => {
      const uniqueVisitorId = await page.evaluate('audubonTracker.getFirstVisit("uniqueVisitorId")');
      expect(uniqueVisitorId).toBeTruthy();
    });

  });

  describe('Checking multi-sessions', () => {
    beforeAll(async () => {
      await page.goto(MULTI_SESSION_PAGE);
      await page.evaluate(aud_tracker);
    });
    
    test('First visit cookie is not overwritten', async () => {
      const firstVisitDate = await page.evaluate('audubonTracker.getFirstVisit("firstVisitDate")');
      expect(firstVisitDate).toBe(todayDate);
    });
  
    test('Session count increased from 1 to 2', async () => {
      const sessionCount = await page.evaluate('audubonTracker.getFirstVisit("sessionCount")');
      expect(sessionCount).toBe(2);
    });
  
  });
  
});
