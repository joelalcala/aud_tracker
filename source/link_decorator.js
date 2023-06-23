// Check if the current domain is not "act.audubon.org"
if (window.location.hostname !== "act.audubon.org") {
    // Get the current page path
    var currentPagePath = window.location.pathname;
  
    // Select all anchor tags with the "act.audubon.org" domain
    var audubonLinks = document.querySelectorAll("a[href*='act.audubon.org']");
  
    // Iterate through each audubon link and add the URL parameter
    for (var i = 0; i < audubonLinks.length; i++) {
      var link = audubonLinks[i];
      var href = link.getAttribute("href");
  
      // Append the "aud_path" parameter with the current page path
      var modifiedHref = href + (href.includes("?") ? "&" : "?") + "aud_path=" + currentPagePath;
  
      // Update the link's href attribute
      link.setAttribute("href", modifiedHref);
    }
  }
  