var Build = Backbone.Model.extend({
  tagName: 'li',

  restart: function() {
    var restartUrl = 'https://www.codeship.io/api/v1/builds/' + this.id + '/restart.json'

    $.post(restartUrl, App.options)
      .done(function() {
        this.set({status: 'testing'});
      }.bind(this))
      .fail(function(err) {
        console.error('restart error:', err);
      });
  },

  getStatus: function() {
    return Build.STATES[this.attributes.status]
  }

}, {
  STATES: {
    stopped: 0,
    success: 1,
    error: 2,
    testing: 3
  }
});
