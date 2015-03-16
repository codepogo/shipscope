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
        chrome.tabs.create({url: 'https://codeship.com/projects/' + build.get('project_id') + '/builds/' + build.get('id')})
        clearNotification(notificationId)
      } else console.debug('could not find build for notificationId:', notificationId)
    },

    onNotificationClosed = function(notificationId) {
      clearNotification(notificationId)
    },

    showNotification = function(project, build) {
      var msg= '[' + ellipsify(build.get('branch'), 20) + '] ' + build.get('status') + '\n' + ellipsify(build.get('message'), 30),
          options = {
            type: "basic",
            title: project.get('repository_name'),
            message: msg,
            priority: 1,
            iconUrl: "img/shipscope_icon_" + build.get('status') + "_128.png"
          }

      chrome.notifications.create(build.get('uuid'), options, onCreateNotification);

      isWatching[build.get('uuid')].set({status: 'notifying'})
    }

  chrome.notifications.onClicked.addListener(onNotificationClicked)
  chrome.notifications.onClosed.addListener(onNotificationClosed)

  return {
    scan: function(projects) {
      projects.forEach(function(project) {
        project.get('builds').forEach(function(build) {
          var uuid = build.get('uuid'),
              status = build.get('status')

          if (status == 'testing') {
            isWatching[uuid] = build.clone()
          } else if (isWatching[uuid] && isWatching[uuid].get('status') == 'testing') {
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
