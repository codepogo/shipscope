var BuildWatcher = (function() {
  var
    isWatching = {},
    api = new CodeshipApi()

    ellipsify = function(str, max) {
      if (str == null) return str
      str = str.trim()
      if (str.length > max) str = str.substr(0, max) + '...'
      return str
    },

    onCreateNotification = function(notificationId) {
      if (notificationId) {
        setTimeout(function() {
            chrome.notifications.clear(notificationId, function(wasCleared) {})
          }, 5000)
      } else {
        console.error('runtime error:', chrome.runtime.lastError)
      }
    },

    clearNotification = function(notificationId) {
      delete isWatching[notificationId]
    },

    onNotificationClicked = function(notificationId) {
      var build = isWatching[notificationId]
      if (build) {
        chrome.tabs.create({url: 'https://codeship.com/projects/' + build.project_id + '/builds/' + build.id})
        clearNotification(notificationId)
      } else console.debug('could not find build for notificationId:', notificationId)
    },

    onNotificationClosed = function(notificationId) {
      clearNotification(notificationId)
    },

    showNotification = function(project, build) {
      var msg= '[' + ellipsify(build.branch, 20) + '] ' + build.status + '\n' + ellipsify(build.message, 30),
          options = {
            type: "basic",
            title: project.repository_name,
            message: msg,
            priority: 1,
            iconUrl: "img/shipscope_icon_" + build.status + "_128.png"
          }

      chrome.notifications.create(build.uuid, options, onCreateNotification);

      isWatching[build.uuid].status = 'notifying'
    }

  chrome.notifications.onClicked.addListener(onNotificationClicked)
  chrome.notifications.onClosed.addListener(onNotificationClosed)

  return {
    scan: function(projects) {
      projects.forEach(function(project) {
        project.attributes.builds.forEach(function(build) {
          if (build.status == 'testing') {
            isWatching[build.uuid] = build
          } else if (isWatching[build.uuid] && isWatching[build.uuid].status == 'testing') {
            showNotification(project, build)
          }
        })
      })
    },

    getWatchList: function() {
      return isWatching
    }
  }
});
