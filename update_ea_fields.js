
// Append data to EA form submissions
window.nvtag_callbacks = window.nvtag_callbacks || {};
window.nvtag_callbacks.alterPost = window.nvtag_callbacks.alterPost || [];

window.nvtag_callbacks.alterPost.push(function (args) {
  args.data.oa_last_ms = audubonTracker.getSession('parameters').ms ? audubonTracker.getSession('parameters').ms : '';
  args.data.oa_first_ms = audubonTracker.getFirstVisit('parameters').ms ? audubonTracker.getFirstVisit('parameters').ms : '';
  args.data.oa_last_utm_source = audubonTracker.getSession('parameters').source ? audubonTracker.getSession('parameters').source : '';
  args.data.oa_first_utm_source = audubonTracker.getFirstVisit('parameters').source ? audubonTracker.getFirstVisit('parameters').source : '';
  args.data.oa_last_utm_medium = audubonTracker.getSession('parameters').medium ? audubonTracker.getSession('parameters').medium : '';
  args.data.oa_first_utm_medium = audubonTracker.getFirstVisit('parameters').medium ? audubonTracker.getFirstVisit('parameters').medium : '';
  args.data.oa_last_utm_campaign = audubonTracker.getSession('parameters').campaign ? audubonTracker.getSession('parameters').campaign : '';
  args.data.oa_first_utm_campaign = audubonTracker.getFirstVisit('parameters').campaign ? audubonTracker.getFirstVisit('parameters').campaign : '';
  args.data.oa_last_utm_content = audubonTracker.getSession('parameters').content ? audubonTracker.getSession('parameters').content : '';
  args.data.oa_first_utm_content = audubonTracker.getFirstVisit('parameters').content ? audubonTracker.getFirstVisit('parameters').content : '';
  args.data.oa_last_utm_term = audubonTracker.getSession('parameters').term ? audubonTracker.getSession('parameters').term : '';
  args.data.oa_first_utm_term = audubonTracker.getFirstVisit('parameters').term ? audubonTracker.getFirstVisit('parameters').term : '';
  args.data.oa_last_ip = audubonTracker.getSession('ip') ? audubonTracker.getSession('ip') : '';
  args.data.oa_first_ip = audubonTracker.getFirstVisit('ip') ? audubonTracker.getFirstVisit('ip') : '';
  args.data.oa_last_browser = audubonTracker.getSession('browser') ? audubonTracker.getSession('browser') : '';
  args.data.oa_first_browser = audubonTracker.getFirstVisit('browser') ? audubonTracker.getFirstVisit('browser') : '';
  args.data.oa_last_device = audubonTracker.getSession('device') ? audubonTracker.getSession('device') : '';
  args.data.oa_first_device = audubonTracker.getFirstVisit('device') ? audubonTracker.getFirstVisit('device') : '';
  args.data.oa_last_page_path = audubonTracker.getSession('pagePath') ? audubonTracker.getSession('pagePath') : '';
  args.data.oa_first_page_path = audubonTracker.getFirstVisit('pagePath') ? audubonTracker.getFirstVisit('pagePath') : '';
  args.data.oa_last_subdomain = audubonTracker.getSession('subdomain') ? audubonTracker.getSession('subdomain') : '';
  args.data.oa_first_subdomain = audubonTracker.getFirstVisit('subdomain') ? audubonTracker.getFirstVisit('subdomain') : '';
  args.data.oa_last_referrer = audubonTracker.getSession('referrer') ? audubonTracker.getSession('referrer') : '';
  args.data.oa_first_referrer = audubonTracker.getFirstVisit('referrer') ? audubonTracker.getFirstVisit('referrer') : '';
  args.data.oa_last_cta = audubonTracker.getSession('cta') ? audubonTracker.getSession('cta') : '';
  args.data.oa_first_cta = audubonTracker.getSession('clickPath') ? audubonTracker.getSession('clickPath') : '';
});