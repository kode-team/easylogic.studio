chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.create({ url: "popup.html" });
});
