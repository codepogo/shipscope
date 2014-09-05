var BuildWatcher = (function() {
  var
    isWatching = {},

    ellipsify = function(str, max) {
      if (str == null) return str
      str = str.trim()
      if (str.length > max) str = str.substr(0, max) + '...'
      return str
    }

    showNotification = function(project, build) {
      var msg
      if (build.status == 'success') {
        msg = '[' + build.branch + '] succeeded.\n' +  ellipsify(build.message, 30)
      } else if (build.status == 'error') {
        msg = '[' + build.branch + '] failed.\n' + ellipsify(build.message, 30)
      } else {
        msg = '[' + build.branch + '] was stopped.\n' + ellipsify(build.message, 30)
      }

      var options = {
        type: "basic",
        title: "shipscope: " + project.repository_name,
        message: msg,
        priority: 1,
        iconUrl: "img/shipscope_icon_" + build.status + "_128.png"
      };
      chrome.notifications.create(build.uuid, options, function() {});
    }

  return {
    scan: function(projects) {
      projects.forEach(function(project) {
        project.builds.forEach(function(build) {
          if (build.status == 'testing') {
            isWatching[build.id] = true
          } else if (isWatching[build.id]) {
            showNotification(project, build)
            delete isWatching[build.id]
          }
        })
      })
    },

    getWatchList: function() {
      return isWatching
    }
  }
});
