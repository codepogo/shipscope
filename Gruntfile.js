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

    compress: {
      main: {
        options: {
          archive: 'deploy/shipscope_v' + manifest.version + '.zip'
        },
        expand: true,
        cwd: './app/',
        src: [ '*.html', 'manifest.json', 'css/**/*', 'img/**/*.png', 'js/**/*', 'lib/**/*', '_locales/**/*' ],
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      shipscope: {
        files: {
          'app/dest/shipscope.min.js': 'app/js/**/*.js'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-karma')
  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.loadNpmTasks('grunt-contrib-uglify')

  grunt.registerTask('build', ['compress'])
}
