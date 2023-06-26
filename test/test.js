const puppeteer = require('puppeteer');
const fs = require('fs');

describe('Audubon Tracker Test', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();

    // Load the page
    await page.goto('https://www.audubon.org/field-guide/bird/magnificent-frigatebird?ms=digital-eng-social-facebook-x-20230600-nas_eng&utm_source=facebook&utm_medium=social&utm_campaign=20230600_nas_eng');
  });

  afterAll(async () => {
    // Close the browser after all tests are completed
    await browser.close();
  });

  it('should track and store session data correctly', async () => {
    // Load the tracking script from the project folder
    const trackingScript = fs.readFileSync('./src/aud_tracker.js', 'utf8');
    await page.evaluate(trackingScript);

    // Track the data
    await page.evaluate(() => {
      audubonTracker.track();
    });

    // Wait for the tracking script to execute
    await page.waitForTimeout(2000);

    // Test whether the session data cookie has been created
    const sessionCookie = await page.cookies('https://www.audubon.org');
    expect(sessionCookie.find(cookie => cookie.name === 'aud_sv')).toBeTruthy();

    // Test the getter functions for session data
    const pagePath = await page.evaluate(() => {
      return audubonTracker.getSession('pagePath');
    });
    expect(pagePath).toBe('/field-guide/bird/magnificent-frigatebird');

    const subdomain = await page.evaluate(() => {
      return audubonTracker.getSession('subdomain');
    });
    expect(subdomain).toBe('www');

    const sessionCount = await page.evaluate(() => {
      return audubonTracker.getSession('sessionCount');
    });
    expect(sessionCount).toBe(1);

    const urlParams = await page.evaluate(() => {
      return audubonTracker.getSession('urlParams');
    });
    expect(urlParams).toEqual({
      ms: 'digital-eng-social-facebook-x-20230600-nas_eng',
      utm_source: 'facebook',
      utm_medium: 'social',
      utm_campaign: '20230600_nas_eng'
    });

    const firstVisitDate = await page.evaluate(() => {
      return audubonTracker.getFirstVisit('firstVisitDate');
    });
    const now = new Date();
    const formattedDate = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
    expect(firstVisitDate).toBe(formattedDate);

    const ipAddress = await page.evaluate(() => {
      return audubonTracker.getSession('ipAddress');
    });
    expect(ipAddress).toBeTruthy();
  });

  it('should still have session data after navigating to a different domain', async () => {
    // Navigate to another page
    await page.goto('https://act.audubon.org/a/donate?ms=digital-fund-web-website_nas-topmenu_donate_20200800&aud_path=/field-guide/bird/magnificent-frigatebird&aud_cta=nav');

    // Test whether the session data cookie is still available after switching domains
    const sessionCookieAfterNav = await page.cookies('https://www.audubon.org');
    expect(sessionCookieAfterNav.find(cookie => cookie.name === 'aud_sv')).toBeTruthy();

    // Test the getter functions for session data after navigating to a different domain
    const pagePathAfterNav = await page.evaluate(() => {
      return audubonTracker.getSession('pagePath');
    });
    expect(pagePathAfterNav).toBe('/field-guide/bird/magnificent-frigatebird');

    const subdomainAfterNav = await page.evaluate(() => {
      return audubonTracker.getSession('subdomain');
    });
    expect(subdomainAfterNav).toBe('www');

    const sessionCountAfterNav = await page.evaluate(() => {
      return audubonTracker.getSession('sessionCount');
    });
    expect(sessionCountAfterNav).toBe(1);
  });

  it('should track and store cta and clickpath correctly on subsequent page view', async () => {
    // Load the tracking script again
    const trackingScript = fs.readFileSync('./src/aud_tracker.js', 'utf8');
    await page.evaluate(trackingScript);

    // Track the data again
    await page.evaluate(() => {
      audubonTracker.track();
    });

    // Wait for the tracking script to execute
    await page.waitForTimeout(2000);

    // Test the getter functions for cta and clickpath
    const cta = await page.evaluate(() => {
      return audubonTracker.getSession('cta');
    });
    expect(cta).toBe('nav');

    const clickPath = await page.evaluate(() => {
      return audubonTracker.getSession('clickPath');
    });
    expect(clickPath).toBe('/field-guide/bird/magnificent-frigatebird');
  });
});
