# Aud Tracker
Just a set of tracking scripts.

## What's included?
- **aud_tracker.js**: Script that tracks various user information and store it in cookies. It allows you to track and retrieve information such as browser details, device information, page path, subdomain, referrer, URL parameters, IP address, first visit data, click path, and session count.
- **update_ea_fields.js**: Script that updates updates hidden metadata fields in EveryAction forms. 

## Variables Tracked

### Browser

The `browser` variable stores the browser information of the user.

**Code for Retrieval:**

```javascript
// Retrieve browser from the session data
const browserFromSession = audubonTracker.getSession('browser');

// Retrieve browser from the first visit data
const browserFromFirstVisit = audubonTracker.getFirstVisit('browser');
```

### Device

The `device` variable stores the platform or device information of the user.

**Code for Retrieval:**
```javascript
// Retrieve device from the session data
const deviceFromSession = audubonTracker.getSession('device');

// Retrieve device from the first visit data
const deviceFromFirstVisit = audubonTracker.getFirstVisit('device');
```

### Landing Page Path

The `pagePath` variable stores the current page path of the user.

**Code for Retrieval:**
```javascript
// Retrieve page path from the session data
const pagePathFromSession = audubonTracker.getSession('pagePath');

// Retrieve page path from the first visit data
const pagePathFromFirstVisit = audubonTracker.getFirstVisit('pagePath');
```

### Landing Subdomain

The `subdomain` variable stores the subdomain of the current URL.

**Code for Retrieval:**
```javascript
// Retrieve subdomain from the session data
const subdomainFromSession = audubonTracker.getSession('subdomain');

// Retrieve subdomain from the first visit data
const subdomainFromFirstVisit = audubonTracker.getFirstVisit('subdomain');
```

### Referrer

The `referrer` variable stores the referrer URL of the current page.

**Code for Retrieval:**
```javascript
// Retrieve referrer from the session data
const referrerFromSession = audubonTracker.getSession('referrer');

// Retrieve referrer from the first visit data
const referrerFromFirstVisit = audubonTracker.getFirstVisit('referrer');
```

### URL Parameters

The `parameters` variable stores the specific URL parameters specified in the `specificUrlParams` array.

**Code for Retrieval:**
```javascript
// Retrieve URL parameters from the session data
const parametersFromSession = audubonTracker.getSession('parameters');

// Retrieve URL parameters from the first visit data
const parametersFromFirstVisit = audubonTracker.getFirstVisit('parameters');
```

### IP Address

The `ip` variable stores the IP address of the user.

**Code for Retrieval:**
```javascript
// Retrieve IP address from the session data
const ipFromSession = audubonTracker.getSession('ip');

// Retrieve IP address from the first visit data
const ipFromFirstVisit = audubonTracker.getFirstVisit('ip');
```

### CTA (Call to Action)

The `cta` variable stores the value of the `aud_cta` URL parameter when the subdomain is "act".

**Code for Retrieval:**
```javascript
// Retrieve CTA from the session data
const ctaFromSession = audubonTracker.getSession('cta');

// Retrieve CTA from the first visit data
const ctaFromFirstVisit = audubonTracker.getFirstVisit('cta');
```

### First Visit Date

The `firstVisitDate` variable stores the date and time of the first visit to the website.

**Code for Retrieval:**
```javascript
// Retrieve IP address from the session data
const ipFromSession = audubonTracker.getSession('ip');

// Retrieve IP address from the first visit data
const ipFromFirstVisit = audubonTracker.getFirstVisit('ip');
```

### Click Path

The `clickPath` variable stores the value of the `aud_path` URL parameter when the subdomain is "act".

**Code for Retrieval:**
```javascript
// Retrieve click path from the session data
const clickPathFromSession = audubonTracker.getSession('clickPath');

// Retrieve click path from the first visit data
const clickPathFromFirstVisit = audubonTracker.getFirstVisit('clickPath');
```

### Session Count

The `sessionCount` variable stores the number of sessions for a user.

**Code for Retrieval:**
```javascript
// Retrieve session count from the session data
const sessionCountFromSession = audubonTracker.getSession('sessionCount');

// Retrieve session count from the first visit data
const sessionCountFromFirstVisit = audubonTracker.getFirstVisit('sessionCount');
```

## Testing steps
Assuming the script is already installed on the website, you can follow these steps to test and retrieve the tracked information:
1. Visit the website with different URLs and subdomains to generate tracking data.
2. Open the browser console on the website.
3. Use the provided code snippets to retrieve the desired information.
4. Replace the variable names in the code snippets with the ones you want to retrieve.
5. Run the code snippets in the console to get the tracked information from the session or first visit data.

Make sure to replace `variableName` with the actual variable names you want to retrieve.
```javascript
// Retrieve browser from the session data
const browserFromSession = audubonTracker.getSession('browser');

// Retrieve browser from the first visit data
const browserFromFirstVisit = audubonTracker.getFirstVisit('browser');

console.log('Browser from Session:', browserFromSession);
console.log('Browser from First Visit:', browserFromFirstVisit);
```