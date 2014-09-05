var Intercom = function() {
  var intercom;

  return {
    intercom: function() { return intercom },
    initialize: function() {
      intercom = chrome.extension.connect({name: "shipscope intercom"})
    }
  }
};
