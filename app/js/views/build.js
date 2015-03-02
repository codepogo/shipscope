var BuildView = Backbone.Marionette.ItemView.extend({
  tagName: 'a',
  className: 'list-group-item',
  template: '#build_item',
  modelEvents: {
    'change:status': 'onStatusChange'
  },

  templateHelpers: function() {
    return {
      getStatusIcon: function() {
        var STATES = {
          stopped: 'warning',
          success: 'success',
          error: 'danger',
          testing: 'info',
          blocked: 'danger',
          infrastructure_failure: 'danger',
        }
        return STATES[this.status];
      },
      projectId: this.projectId
    }
  },

  initialize: function(options) {
    this.projectId = options.projectId
  },

  onStatusChange: function() {
    this.render();
  }
});
