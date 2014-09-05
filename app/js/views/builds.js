var BuildsView = Backbone.Marionette.CollectionView.extend({
  childView: BuildView,
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
      ga('send', 'event', 'popup', 'build_restart', 'request')
      build.restart();
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
