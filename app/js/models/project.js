var Project = Backbone.Model.extend({
  tagName: 'li',

  getStatus: function() {
    var
      builds = new Builds(this.attributes.builds),
      mostRecentBuilds = {},
      projectStatus = Build.STATES.success,
      hasRunningBuild,
      lastMasterBuild;

    if (builds.length > 0) {
      hasRunningBuild = builds.findWhere({status: 'testing'})
      if (hasRunningBuild) {
        projectStatus = Build.STATES.testing
      } else {
        lastMasterBuild = builds.findWhere({branch: 'master'})
        if (lastMasterBuild) {
          projectStatus = lastMasterBuild.getStatus()
        }
      }
    }

    return {
      status: projectStatus
    }
  }
});
