var MainLayout = Backbone.Marionette.LayoutView.extend({
  template: '#mainLayout',
  regions: {
    nav: '#nav',
    project_list: '#project_list'
  },

  events: {
    'click nav h5 a': 'onShowHome',
    'click footer button': 'onShowOptions'
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
        // recreate backbone collection, they get lost in the intercom
        this.collection = new Projects(msg.data)
        this.onShowHome()
      }

      if (msg.type == 'options.set') {
        this.options = new OptionsModel(msg.data)
        App.options = msg.data

        if (!this.options.get('api_key')) {
          this.onShowOptions()
        }
      }
    }.bind(this));

    App.intercom.postMessage({type: 'options.get'})
    App.intercom.postMessage({type: 'projects.get'})
    this.options = new OptionsModel();
  },

  onShowOptions: function() {
    this.options.once('sync', this.onShowOptions);
    $('nav').addClass('project_view');
    $('nav span').text(chrome.i18n.getMessage('options'));
    $('footer').hide();

    this.optionsView = new OptionsView({model: this.options});
    this.project_list.show(this.optionsView);
  },

  onShowHome: function() {
    ga('send', 'event', 'popup', 'view_projects', 'launch')
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
      var builds = new Builds(project.get('builds'))
      var buildsView = new BuildsView({collection: builds}, {projectId: projectId})
      this.project_list.show(buildsView)
    }
  },

});
