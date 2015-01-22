var MainLayout = Backbone.Marionette.LayoutView.extend({
  template: '#mainLayout',
  regions: {
    nav: '#nav',
    project_list: '#project_list'
  },

  events: {
    'click nav h5 a': 'onShowHome',
  },

  initialize: function() {
    Backbone.Events.on('show:project', this.onShowProject, this);
    Backbone.Events.on('show:home', this.onShowHome, this);

    App.intercom.onMessage.addListener(function(msg) {
      if (msg.type == 'projects.set') {
        if (!msg.data) {
          App.intercom.postMessage({type: 'options.get'});
          return;
        }

        if (this.initialized) return;

        this.initialized = true
        this.collection = new Projects(msg.data);

        if (this.options && this.options.get('settings')) {
          this.options.set('projects', this.collection)
        }
        this.onShowHome()
      }

      if (msg.type == 'options.set') {
        console.debug('options.set:', msg.data.settings)
        this.options = new OptionsModel(msg.data.settings)
        App.options = msg.data

        // if (!this.options.get('options')) {
        //   this.onShowOptions()
        // }
      }
    }.bind(this));

    App.intercom.postMessage({type: 'projects.get'})
    App.intercom.postMessage({type: 'options.get'})
    this.options = new OptionsModel();
  },

  onShowHome: function() {
    $('nav').removeClass('project_view');
    $('footer').show();
    this.projectsView = new ProjectsView({collection: this.collection});
    this.project_list.show(this.projectsView);
  },

  onShowProject: function(projectId) {
    var project = this.collection.get(projectId);

    $('nav').addClass('project_view');
    $('nav span').text(project.get('repository_name'));
    $('footer').show();

    if (project) {
      var builds = new Builds(project.get('builds'));
      var buildsView = new BuildsView({collection: builds}, {projectId: projectId});
      this.project_list.show(buildsView);
    }
  },
});
