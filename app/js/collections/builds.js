var Builds = Backbone.Collection.extend({
  model: Build,
  comparator: function(build) {
    if (build.getStatus() == Build.STATES.testing) {
      return 0
    }
    return 1
  }
});
