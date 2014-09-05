var Projects = Backbone.Collection.extend({
  model: Project,
  url: 'https://www.codeship.io/api/v1/projects.json?api_key=',
  apiKey: null,

  initialize: function(models, options) {
    if (options) {
      apiKey = options.apiKey;
    }
  },

  getSummary: function() {
    var highState = {state: 0, count: 0}
    this.each(function(item, index, list) {
      var status = item.getStatus()
      if (status.status > highState.state) {
        highState.state = status.status
        highState.count = 1
      } else if (status.status == highState.state) {
        highState.count += 1
      }
    })
    return highState
  }
});
