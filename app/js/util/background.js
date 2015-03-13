var Background = function() {
  var
    POLLING_INTERVAL = 10000,
    ANALYTICS_INTERVAL = 60000,
    api = new CodeshipApi(),

    buildWatcher,
    pollingInterval,
    options,
    projects,
    intercom,

    initIntercom = function() {
      chrome.extension.onConnect.addListener(function(port) {
        if (intercom) {
          intercom.disconnect()
          intercom = null
        }

        intercom = port;
        intercom.onDisconnect.addListener(function() {
          intercom = null
        })

        intercom.onMessage.addListener(function(msg) {
          if (msg.type == 'options.set') {
            options = msg.data;
            chrome.storage.sync.set(options, function() {
              if (chrome.runtime.lastError) {
                console.error('ERROR setting options:', options, '=>', chrome.runtime.lastError.message);
              }
            });
            if (options && options.api_key) {
              fetchProjectsFromCodeship();
              startPolling();
            }
            return;
          }

          if (msg.type == 'options.get') {
            intercom.postMessage({type: 'options.set', data: options});
          }

          if (msg.type == 'projects.get') {
            intercom.postMessage({type: 'projects.set', data: projects});
            return;
          }
        });
      })
    },

    fetchApiKeyFromLocalStorage = function() {
      chrome.storage.sync.get('api_key', function(value) {
        options = value
        if (options) fetchProjectsFromCodeship()
      });
    }

    fetchProjectsFromCodeship = function() {
      api.fetchAll(options, function(_projects) {
        projects = _projects
        buildWatcher.scan(projects)
        getShipscopeSummary()
      })
    },

    getShipscopeSummary = function() {
      var STATUS_COLORS = [
        '#feb71a',    // stopped
        '#60cc69',    // success
        '#fe402c',    // error
        '#5a95e5'     // testing
      ]

      var status = projects.getSummary()

      chrome.browserAction.setBadgeText({text: status.count.toString()})
      chrome.browserAction.setBadgeBackgroundColor({color: STATUS_COLORS[status.state]})
    },

    initAnalyticsPing = function() {
      setInterval(function() {
        ga('send', 'event', 'background', 'active_user', 'ping')
      }, ANALYTICS_INTERVAL)
    },

    startPolling = function() {
      setInterval(fetchProjectsFromCodeship, POLLING_INTERVAL);
    },

  return {
    initialize: function() {
      buildWatcher = new BuildWatcher()
      initIntercom();
      fetchApiKeyFromLocalStorage();
      initAnalyticsPing()
      startPolling();
    }
  }
};

var background = new Background();
background.initialize();
