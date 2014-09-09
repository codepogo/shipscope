var BuildView = Backbone.Marionette.ItemView.extend({
  tagName: 'a',
  className: 'list-group-item',
  template: '#build_item',
  modelEvents: {
    'change:status': 'onStatusChange'
  },

  templateHelpers: function() {
    return {
      msg: {
        restart_build: chrome.i18n.getMessage('restart_build')
      },
      getStatusIcon: function() {
        var STATES = {
          stopped: 'warning',
          success: 'success',
          error: 'danger',
          testing: 'info',
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
