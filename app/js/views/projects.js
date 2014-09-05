var EmptyView = Backbone.Marionette.ItemView.extend({
  template: '#empty_projects_view'
});

var ProjectsView = Backbone.Marionette.CollectionView.extend({
  childView: ProjectView,
  emptyView: EmptyView,
  className: 'list-group',
  events: {
    'click a': 'onClick'
  },

  initialize: function() {
    this.fetchProjects()
    this.initialPoller = setInterval(this.fetchProjects.bind(this), 500)

    App.intercom.onMessage.addListener(function(msg) {
      if (msg.type == 'projects.set') {
        this.switchToSlowPoller(msg.data)
        if (this.collection) this.collection.reset(msg.data)
      }
    }.bind(this))
  },

  onDestroy: function() {
    if (this.initialPoller) clearInterval(this.initialPoller)
    if (this.poller) clearInterval(this.poller)
  },

  switchToSlowPoller: function(projects) {
    if (this.initialPoller && projects && projects.length > 0) {
      clearInterval(this.initialPoller)
      this.initialPoller = null
      this.poller = setInterval(this.fetchProjects.bind(this), 5000)
    }
  },

  fetchProjects: function() {
    App.intercom.postMessage({type: 'projects.get'})
  },

  onClick: function(event) {
    var info = event.currentTarget.querySelector('span')
    var projectId = info.dataset.id

    ga('send', 'event', 'popup', 'project', 'select')
    Backbone.Events.trigger('show:project', projectId)
  },
});
