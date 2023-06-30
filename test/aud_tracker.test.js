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
    });``
  });

  afterAll(() => {
    browser.close();
  });

  describe('NAS page', () => {
    beforeAll(async () => {
      await page.goto(NAS_PAGE);
      await page.evaluate(aud_tracker);
      await page.evaluate('audubonTracker.track()');
      await page.waitForFunction('audubonTracker.getSession("ipAddress") !== undefined');
    });

    test('Cookies are created and have correct scope', async () => {
      const aud_sv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_sv'));
      const aud_fv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_fv'));
      expect(aud_sv).toBeTruthy();
      expect(aud_fv).toBeTruthy();
      expect(aud_sv.domain).toBe('.audubon.org');
      expect(aud_fv.domain).toBe('.audubon.org');
    });

    test('pagePath is correct', async () => {
      const pagePath = await page.evaluate('audubonTracker.getSession("pagePath")');
      expect(pagePath).toBe('/field-guide/bird/magnificent-frigatebird');
    });

    test('subdomain is correct', async () => {
      const subdomain = await page.evaluate('audubonTracker.getSession("subdomain")');
      expect(subdomain).toBe('www');
    });

    test('sessionCount is correct', async () => {
      const sessionCount = await page.evaluate('audubonTracker.getFirstVisit("sessionCount")');
      expect(sessionCount).toBe(1);
    });

    test('urlParams are correct', async () => {
      const urlParams = await page.evaluate('audubonTracker.getSession("urlParams")');
      expect(urlParams).toEqual(expect.objectContaining({
        ms: 'digital-eng-social-facebook-x-20230600-nas_eng',
        utm_source: 'facebook',
        utm_medium: 'social',
        utm_campaign: '20230600_nas_eng'
      }));
    });

    test('firstVisitDate is correct', async () => {
      const firstVisitDate = await page.evaluate('audubonTracker.getFirstVisit("firstVisitDate")');
      expect(firstVisitDate).toBe(todayDate);
    });

    test('ipAddress is present', async () => {
      const ipAddress = await page.evaluate('audubonTracker.getSession("ipAddress")');
      expect(ipAddress).toBeTruthy();
    });

    test('browser is correct', async () => {
      const browser = await page.evaluate('audubonTracker.getSession("browser")');
      expect(browser).toBe('Chrome');
    });

    test('referrer is correct', async () => {
      const referrer = await page.evaluate('audubonTracker.getSession("referrer")');
      expect(referrer).toBe(REFERRER);
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
      await page.evaluate('audubonTracker.track()');
      await page.waitForFunction('audubonTracker.getSession("ipAddress") !== undefined');
    });

    test('Cookies are still available and have correct scope', async () => {
      const aud_sv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_sv'));
      const aud_fv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_fv'));
      expect(aud_sv).toBeTruthy();
      expect(aud_fv).toBeTruthy();
      expect(aud_sv.domain).toBe('.audubon.org');
      expect(aud_fv.domain).toBe('.audubon.org');
    });

    test('pagePath has not been overwritten', async () => {
      const pagePath = await page.evaluate('audubonTracker.getSession("pagePath")');
      expect(pagePath).toBe('/field-guide/bird/magnificent-frigatebird');
    });

    test('subdomain has not been overwritten', async () => {
      const subdomain = await page.evaluate('audubonTracker.getSession("subdomain")');
      expect(subdomain).toBe('www');
    });

    test('sessionCount has not been overwritten', async () => {
      const sessionCount = await page.evaluate('audubonTracker.getFirstVisit("sessionCount")');
      expect(sessionCount).toBe(1);
    });

    test('urlParams have not been overwritten', async () => {
      const urlParams = await page.evaluate('audubonTracker.getSession("urlParams")');
      expect(urlParams).toEqual(expect.objectContaining({
        ms: 'digital-eng-social-facebook-x-20230600-nas_eng',
        utm_source: 'facebook',
        utm_medium: 'social',
        utm_campaign: '20230600_nas_eng'
      }));
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
      await page.deleteCookie({ name: 'aud_sv' });
      await page.goto(MULTI_SESSION_PAGE);
      await page.evaluate(aud_tracker);
      await page.evaluate('audubonTracker.track()');
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
