const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const aud_tracker = fs.readFileSync(path.resolve(__dirname, '../src/aud_tracker.js'), 'utf8');

describe('Audubon Tracker', () => {
  let browser, page;
  const todayDate = `${new Date().getFullYear().toString().substr(-2)}${String(new Date().getMonth() + 1).padStart(2, "0")}${String(new Date().getDate()).padStart(2, "0")}`;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  afterAll(() => {
    browser.close();
  });

  describe('NAS page', () => {
    beforeAll(async () => {
      await page.goto('https://www.audubon.org/field-guide/bird/magnificent-frigatebird?ms=digital-eng-social-facebook-x-20230600-nas_eng&utm_source=facebook&utm_medium=social&utm_campaign=20230600_nas_eng');
      await page.evaluate(aud_tracker);
      await page.evaluate('audubonTracker.track()');
    });

    test('Cookies are created', async () => {
      const aud_sv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_sv'));
      const aud_fv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_fv'));
      expect(aud_sv).toBeTruthy();
      expect(aud_fv).toBeTruthy();
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
      const sessionCount = await page.evaluate('audubonTracker.getSession("sessionCount")');
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

    test('ipAddress is available', async () => {
      const ipAddress = await page.evaluate('audubonTracker.getSession("ipAddress")');
      expect(ipAddress).toBeTruthy();
    });
  });

  describe('EA page', () => {
    beforeAll(async () => {
      await page.goto('https://act.audubon.org/a/donate?ms=digital-fund-web-website_nas-topmenu_donate_20200800&aud_path=/field-guide/bird/magnificent-frigatebird&aud_cta=nav');
      await page.evaluate(aud_tracker);
      await page.evaluate('audubonTracker.track()');
    });

    test('Cookies are still available', async () => {
      const aud_sv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_sv'));
      const aud_fv = await page.cookies().then(cookies => cookies.find(cookie => cookie.name === 'aud_fv'));
      expect(aud_sv).toBeTruthy();
      expect(aud_fv).toBeTruthy();
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
      const sessionCount = await page.evaluate('audubonTracker.getSession("sessionCount")');
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

    test('cta and clickpath are correct', async () => {
      const cta = await page.evaluate('audubonTracker.getSession("cta")');
      const clickpath = await page.evaluate('audubonTracker.getSession("clickpath")');
      expect(cta).toBe('nav');
      expect(clickpath).toBe('/field-guide/bird/magnificent-frigatebird');
    });
  });
});
