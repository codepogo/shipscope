var CodeshipApi = (function() {
  var
    API_HOST = "https://codeship.com/api",
    PROJECT_URL = API_HOST + "/v2/projects.json",
    BUILD_URL = API_HOST + "/v1/builds.json",

    fetchAll = function(options, callback) {
      fetchProjects(options, function(projects) {
        async.each(projects.models, function(project, done) {
          fetchBuilds(options, project, function(builds) {
            project.set({builds: builds});
            done()
          })
        }, function(error) {
          if (error) {
            // error handling
          } else {
            callback(projects)
          }
        })
      })
    },

    fetchBuilds = function(options, project, callback) {
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
    },

    fetchProjects = function(options, callback) {
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
    }

  return {
    fetchAll: function(options, callback) {
      fetchAll(options, callback)
    }
  }
});
