var Background = function() {
  var
    POLLING_INTERVAL = 10000,
    ANALYTICS_INTERVAL = 60000,
    CODESHIP_URL = 'https://codeship.com/api/v1/projects.json',
    FAKE_URL = 'https://localhost:6060/projects.json',
    URL = CODESHIP_URL,

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
    },

    fetchProjectsFromCodeship = function() {
      if (options && options.api_key != undefined) {
        console.debug('fetch!');
        // if (FAKE) {
        //   fetchFakeProjects()
        //   getShipscopeSummary()
        //   if (intercom) intercom.postMessage({type: 'api_ok'})
        //   return
        // }

        var params = 'api_key=' + options.api_key

        $.getJSON(URL, params)
          .done( function(response) {
            projects = new Projects(response.projects)
            buildWatcher.scan(response.projects)
            getShipscopeSummary()
            if (intercom) intercom.postMessage({type: 'api_ok'})
          })
          .fail(function(err) {
            ga('send', 'event', 'background', 'fetch_projects', 'error')
            if (intercom) intercom.postMessage({type: 'error', data: err})
          });
      }
    },

    getShipscopeSummary = function() {
      var STATUS_COLORS = [
        '#ff7f00', '#0b0', '#f00', '#00f'
      ]

      var status = projects.getSummary()

      chrome.browserAction.setBadgeText({text: status.count.toString()})
      chrome.browserAction.setBadgeBackgroundColor({color: STATUS_COLORS[status.state]})
    },

    fetchFakeProjects = function() {
      json = JSON.parse('[{"id":26225,"builds":[{"id":1795957,"uuid":"2f406670-007f-0132-cb2f-5247614ee66f","status":"success","commit_id":"03aa27da48bf5d6ee5c162351a2d7f721cc1ad28","message":"testing a codeship build","branch":"backbonify"},{"id":1601722,"uuid":"70d42460-e9fd-0131-b97c-5a04e3162754","status":"testing","commit_id":"c36460f43313a549437ec410270376bf3edd4729","message":"turned this into a quite long commit message so i could consider committing this in order to see what happens","branch":"master"},{"id":1601711,"uuid":"8424fba0-007f-0132-8277-1eba7344906a","status":"error","commit_id":"fab58ad0ba4ec78efee303ef6d3dd9824cab2c78","message":"corrected backbone and less config issues.","branch":"master"},{"id":1600121,"uuid":"8905dee0-e9d9-0131-1ab9-0ec2eab3611a","status":"success","commit_id":"84beb1684c33fdb7f7287ea634adcfbdb6a6d59b","message":"testing deployment via codeship through heroku","branch":"master"},{"id":1597401,"uuid":"db9b2340-e9b0-0131-d588-2acc9bb7d407","status":"success","commit_id":"f8acebd3f5ec31e30dfca2744d65839a37951a27","message":"remove nodemon","branch":"master"},{"id":1597263,"uuid":"cb7c9950-e9ae-0131-d588-2acc9bb7d407","status":"error","commit_id":"5e5da103215485cdda811712a996799ce5a37834","message":"added nodemon to package.json","branch":"master"},{"id":1597235,"uuid":"d11930d0-e9ae-0131-0f9a-5e10f8b94a21","status":"error","commit_id":"c09f551dfa210b30a288ef1c71d22153ae0fbeac","message":"this is probably broken.","branch":"master"}],"repository_name":"codepogo/unboggler"},' + 
          '{"id":26226,"builds":[{"id":1597235,"uuid":"d11930d0-e9ae-0131-0f9a-5e10f8b94a21","status":"success","commit_id":"c09f551dfa210b30a288ef1c71d22153ae0fbeac","message":"this is probably broken.","branch":"master"}],"repository_name":"codepogo/shipscope"}]');
      projects = new Projects(json);
    },

    initAnalyticsPing = function() {
      setInterval(function() {
        ga('send', 'event', 'background', 'active_user', 'ping')
      }, ANALYTICS_INTERVAL)
    },

    startPolling = function() {
      setInterval(fetchProjectsFromCodeship, POLLING_INTERVAL);
    }

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
