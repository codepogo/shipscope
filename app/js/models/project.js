var Project = Backbone.Model.extend({
  tagName: 'li',

  getStatus: function() {
    var
      builds = new Builds(this.attributes.builds),
      mostRecentBuilds = {}
      projectStatus = 0

    builds.each(function(item, index, list) {
      if (mostRecentBuilds[item.attributes.branch] == undefined) {
        mostRecentBuilds[item.attributes.branch] = item.getStatus()
      }
    })

    projectStatus = _.reduce(mostRecentBuilds, function(previous, current) {
      return Math.max(previous, current)
    })

    return {
      count: Object.keys(mostRecentBuilds).length,
      status: projectStatus
    }
  }
});
