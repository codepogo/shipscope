var CodeshipApi = (function() {
  var
    PROJECT_URL = "https://codeship.com/api/v2/projects.json",
    BUILD_URL = "https://codeship.com/api/v2/projects.json",

    options,

    fetchBuilds = function(project, callback) {
      fetchApiKeyFromLocalStorage(function(){
        var params = 'api_key=' + options.api_key + "&project_id=" + project.id

        $.getJSON(BUILD_URL, params)
          .done( function(response) {
            builds_collection = new Builds(response.builds)
            callback(builds_collection)
          })
          .fail(function(err) {
            ga('send', 'event', 'background', 'fetch_builds', 'error')
            if (intercom) intercom.postMessage({type: 'error', data: err})
          });
      })
    },

    fetchProjects = function(callback) {
      fetchApiKeyFromLocalStorage(function() {
        if (options && options.api_key != undefined) {
          var params = 'api_key=' + options.api_key
          $.getJSON(PROJECT_URL, params)
            .done( function(response) {
              projects_collection = new Projects(response.projects)
              callback(projects_collection)
            })
            .fail(function(err) {
              ga('send', 'event', 'background', 'fetch_projects', 'error')
            });
        }
      })
    },

    fetchApiKeyFromLocalStorage = function(callback) {
      chrome.storage.sync.get('api_key', function(value) {
        options = value
        callback()
      });
    }

  return {
    fetchProjects: function(callback) {
      fetchProjects(callback)
    },

    fetchBuilds: function(project, callback) {
      fetchBuilds(project, callback)
    }
  }
});
