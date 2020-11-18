sha1 = require('js-sha1');

(function() {
  function onInstallClick(event) {
    let installLink = event.target;
    if (installLink.getAttribute("data-is-previous-version") == "true") {
      if (!confirm(installLink.getAttribute("data-previous-version-warning"))) {
        event.preventDefault();
        return;
      }
    }
    let ping_key = sha1(installLink.getAttribute("data-ip-address") + installLink.getAttribute("data-script-id") + installLink.getAttribute("data-ping-key"));

    let xhr = new XMLHttpRequest();
    let pingUrl = event.target.getAttribute("data-ping-url")
    xhr.open("POST", pingUrl + (pingUrl.includes('?') ? '&' : '?') + "ping_key=" + encodeURIComponent(ping_key), true);
    xhr.overrideMimeType("text/plain");
    xhr.send();

    // Give time for the ping request to happen.
    setTimeout(function() {
      location.href = installLink.href;
    }, 100);

    setTimeout(showPostInstall, 2000);

    event.preventDefault();
  }

  function onInstallMouseOver(event) {
    let url = event.target.getAttribute("data-ping-url");
    if (!url.endsWith('&mo=1')) {
      event.target.setAttribute("data-ping-url", url + "&mo=1");
    }
  }

  function showPostInstall() {
    let postInstall = document.querySelector(".post-install");
    if (!postInstall) {
      return;
    }
    postInstall.style.display = 'flex';
  }

  function init() {
    document.querySelectorAll(".install-link").forEach(function(installLink) {
      installLink.addEventListener("click", onInstallClick);
      installLink.addEventListener("mouseover", onInstallMouseOver);
    });
  }

  window.addEventListener("DOMContentLoaded", init);
})();
