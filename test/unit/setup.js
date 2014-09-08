// shim for providing chrome.i18n if this is running as a test
if (chrome.i18n === undefined) {
  chrome.i18n = {
    getMessage: function() { return 'STUBBED' }
  }
}
