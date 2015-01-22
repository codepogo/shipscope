// Handlebars!
Backbone.Marionette.TemplateCache.prototype.compileTemplate = function(rawTemplate) {
  return Handlebars.compile(rawTemplate);
};

var App = new Marionette.Application();

App.addRegions({
  main: 'body',
});

var cacheTemplates = function() {
    Backbone.Marionette.TemplateCache.get('#build_item');
    Backbone.Marionette.TemplateCache.get('#project_item');
    Backbone.Marionette.TemplateCache.get('#options_view');
    Backbone.Marionette.TemplateCache.get('#empty_projects_view');
    Backbone.Marionette.TemplateCache.get('#empty_builds_view');
  },

  openIntercom = function() {
    App.intercom = chrome.extension.connect({name: "shipscope intercom"});

    if (App.intercom) {
      App.main.show(new MainLayout());
    } else {
      console.error('Could not get the intercom.');
    }
  };

App.addInitializer(cacheTemplates);
App.addInitializer(openIntercom);

App.on('initialize:after', function() {
  Backbone.history.start({pushState: true});
});

App.start();
