var Project = Backbone.Model.extend({
  tagName: 'li',

  getStatus: function() {
    var
      builds = this.attributes.builds,
      mostRecentBuilds = {},
      projectStatus = Build.STATES.success,
      hasRunningBuild,
      lastMasterBuild;

    if (builds && builds.length > 0) {
      hasRunningBuild = builds.findWhere({status: 'testing'})
      console.debug('build.status.hasRunning:', hasRunningBuild)
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
  },
});
