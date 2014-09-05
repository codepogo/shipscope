var ProjectView = Backbone.Marionette.ItemView.extend({
  tagName: 'a',
  className: 'list-group-item',
  template: '#project_item',

  templateHelpers: {
    getStatus: function() {
      var STATES = [ 'warning', 'success', 'danger', 'info' ]

      return STATES[this.projectStatus.status]
    },
  },

  serializeData: function() {
    var project = Backbone.Marionette.ItemView.prototype.serializeData.apply(this, arguments)
    project.projectStatus = this.model.getStatus()
    return project
  }
});

