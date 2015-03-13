// Karma configuration
// Generated on Tue Aug 12 2014 16:13:07 GMT-0400 (EDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '.',

    preprocessors: {
      'app/js/**/*.js': 'coverage'
    },

    // frameworks to use
    frameworks: ['mocha', 'chai', 'sinon-chai'],


    // list of files / patterns to load in the browser
    files: [
      'test/unit/setup.js',

      'app/lib/jquery.min.js',
      'app/lib/bootstrap.min.js',
      'app/lib/underscore-min.js',
      'app/lib/backbone-min.js',
      'app/lib/backbone.babysitter.min.js',
      'app/lib/backbone.wreqr.min.js',
      'app/lib/backbone.marionette.min.js',
      'app/lib/handlebars.js',


      'app/js/models/build.js',
      'app/js/models/project.js',
      'app/js/models/options.js',

      'app/js/collections/builds.js',
      'app/js/collections/projects.js',

      'app/js/util/codeship_api.js',
      'app/js/util/build_watcher.js',
      'app/js/views/*.js',

      'test/unit/**/*_spec.js',
      'test/fixtures/**/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      reporters: [
        {type: 'html', dir: 'coverage'},
        {type: 'text-summary'}
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    // browsers: ['Chrome', 'PhantomJS'],
    browsers: ['Chrome'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
