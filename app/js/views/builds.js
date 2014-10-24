var EmptyBuildsView = Backbone.Marionette.ItemView.extend({
  template: '#empty_builds_view',
  templateHelpers: {
    msg: {
      no_builds: chrome.i18n.getMessage('no_builds')
    }
  }
});

var BuildsView = Backbone.Marionette.CollectionView.extend({
  childView: BuildView,
  emptyView: EmptyBuildsView,
  className: 'list-group',
  events: {
    'click a.build_status': 'onClick'
  },

  onClick: function(event) {
    event.preventDefault();
    var
      id = event.currentTarget.dataset.id,
      build = this.collection.get(id);

    if (build) {
      if (build.get('status') != 'testing') {
        ga('send', 'event', 'popup', 'build_restart', 'request')
        build.restart();
      }
    } else {
      console.warn('could not find build:', id);
    }
  },

  childViewOptions: function() {
    return {
      projectId: this.projectId
    }
  },

  initialize: function(attrs, options) {
    this.projectId = options.projectId;
  },
});
