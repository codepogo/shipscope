var CodeshipApi = (function() {
  var
    PROJECT_URL = "https://codeship.com/api/v2/projects.json",
    BUILD_URL = "https://codeship.com/api/v2/projects.json",

    options,

    fetchBuilds = function(project) {
      var params = 'api_key=' + options.api_key + "&project_id=" + project.id

      $.getJSON(BUILD_URL, params)
        .done( function(response) {
          return response.builds
        })
        .fail(function(err) {
          ga('send', 'event', 'background', 'fetch_builds', 'error')
          if (intercom) intercom.postMessage({type: 'error', data: err})
        });
    },

    fetchProjects = function() {
      if (options && options.api_key != undefined) {
        var params = 'api_key=' + options.api_key

        $.getJSON(PROJECT_URL, params)
          .done( function(response) {
            return response.projects
            if (intercom) intercom.postMessage({type: 'api_ok'})
          })
          .fail(function(err) {
            ga('send', 'event', 'background', 'fetch_projects', 'error')
            if (intercom) intercom.postMessage({type: 'error', data: err})
          });
      }
    },

    fetchApiKeyFromLocalStorage = function() {
      chrome.storage.sync.get('api_key', function(value) {
        options = value
        if (options) fetchProjectsFromCodeship()
      });
    }

  return {
    initialize: function() {
      fetchApiKeyFromLocalStorage();
    }
  }
});
