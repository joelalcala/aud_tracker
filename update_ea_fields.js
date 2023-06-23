
// Append data to EA form submissions
window.nvtag_callbacks = window.nvtag_callbacks || {};
window.nvtag_callbacks.alterPost = window.nvtag_callbacks.alterPost || [];

window.nvtag_callbacks.alterPost.push(function (args) {
  args.data.oa_last_ms = audubonTracker.getSession('ms');
  args.data.oa_first_ms = audubonTracker.getFirstVisit('ms');
  args.data.oa_last_utm_source = audubonTracker.getSession('utm_source');
  args.data.oa_first_utm_source = audubonTracker.getFirstVisit('utm_source');
  args.data.oa_last_utm_medium = audubonTracker.getSession('utm_medium');
  args.data.oa_first_utm_medium = audubonTracker.getFirstVisit('utm_medium');
  args.data.oa_last_utm_campaign = audubonTracker.getSession('utm_campaign');
  args.data.oa_first_utm_campaign = audubonTracker.getFirstVisit('utm_campaign');
  args.data.oa_last_utm_content = audubonTracker.getSession('utm_content');
  args.data.oa_first_utm_content = audubonTracker.getFirstVisit('utm_content');
  args.data.oa_last_utm_term = audubonTracker.getSession('utm_term');
  args.data.oa_first_utm_term = audubonTracker.getFirstVisit('utm_term');
  args.data.oa_last_ip = audubonTracker.getSession('ip');
  args.data.oa_first_ip = audubonTracker.getFirstVisit('ip');
  args.data.oa_last_browser = audubonTracker.getSession('browser');
  args.data.oa_first_browser = audubonTracker.getFirstVisit('browser');
  args.data.oa_last_device = audubonTracker.getSession('device');
  args.data.oa_first_device = audubonTracker.getFirstVisit('device');
  args.data.oa_last_page_path = audubonTracker.getSession('pagePath');
  args.data.oa_first_page_path = audubonTracker.getFirstVisit('pagePath');
  args.data.oa_last_subdomain = audubonTracker.getSession('subdomain');
  args.data.oa_first_subdomain = audubonTracker.getFirstVisit('subdomain');
  args.data.oa_last_referrer = audubonTracker.getSession('referrer');
  args.data.oa_first_referrer = audubonTracker.getFirstVisit('referrer');
  args.data.oa_last_cta = audubonTracker.getSession('cta');
});