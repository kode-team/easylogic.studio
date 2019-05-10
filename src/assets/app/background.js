chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create("popup.html", {
    outerBounds: {
      width: 1200,
      height: 1000
    }
  });
});
