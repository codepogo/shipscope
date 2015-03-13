var Project = Backbone.Model.extend({
  tagName: 'li',

  builds: function() {
    api = new CodeshipApi()
    builds = api.fetchProjects(this)
    builds_collection = new Builds(builds)
    return builds_collection
  },

  getStatus: function() {
    var
      mostRecentBuilds = {},
      projectStatus = Build.STATES.success,
      hasRunningBuild,
      lastMasterBuild;

    if (this.builds.length > 0) {
      hasRunningBuild = this.builds.findWhere({status: 'testing'})
      if (hasRunningBuild) {
        projectStatus = Build.STATES.testing
      } else {
        lastMasterBuild = this.builds.findWhere({branch: 'master'})
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
