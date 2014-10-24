var Project = Backbone.Model.extend({
  tagName: 'li',

  getStatus: function() {
    var
      builds = new Builds(this.attributes.builds),
      mostRecentBuilds = {},
      projectStatus = Build.STATES.success;

    if (builds.length > 0) {
      var lastMasterBuild = builds.findWhere({branch: 'master'})
      if (lastMasterBuild) {
        projectStatus = lastMasterBuild.getStatus()
      }
    }

    return {
      status: projectStatus
    }
  }
});
