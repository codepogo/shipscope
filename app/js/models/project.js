var Project = Backbone.Model.extend({
  tagName: 'li',

  getStatus: function() {
    var
      builds = this.attributes.builds,
      mostRecentBuilds = {},
      projectStatus = Build.STATES.success,
      hasRunningBuild,
      lastMasterBuild;

    // we lose the backbone collection,
    // init builds collection after passing to the frontend
    if (Array.isArray(builds)) {
      builds = new Builds(builds)
    }

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
  },
});
