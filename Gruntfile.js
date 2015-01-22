manifest = require('./app/manifest.json')

module.exports = function(grunt) {
  grunt.initConfig({
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['Chrome'],
        logLevel: 'ERROR'
      }
    },

    clean: [
      'app/dest',
      'deploy',
      'coverage'
    ],

    compress: {
      main: {
        options: {
          archive: 'deploy/shipscope.zip'
        },
        expand: true,
        cwd: './app/',
        src: [ '*.html', 'manifest.json', 'css/**/*', 'img/**/*.png', 'dest/**/*.js', 'lib/**/*', '_locales/**/*' ],
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      shipscope: {
        files: {
          'app/dest/shipscope.min.js': [
            'app/js/util/ga.js',
            'app/js/models/**/*.js',
            'app/js/collections/**/*.js',
            'app/js/views/**/*.js',
            'app/js/app.js',
          ],
          'app/dest/shipscope-background.min.js': [
            'app/js/util/ga.js',
            'app/js/util/build_watcher.js',
            'app/js/models/build.js',
            'app/js/models/project.js',
            'app/js/collections/builds.js',
            'app/js/collections/projects.js',
            'app/js/util/background.js'
          ]
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-clean')

  grunt.registerTask('test', ['clean', 'uglify', 'karma'])
  grunt.registerTask('build', ['clean', 'uglify', 'compress'])
  grunt.registerTask('default', ['build'])
}
