module.exports = function(grunt) {
  grunt.initConfig({
    jekyll: {
      options: {
        bundleExec: true,
        src : '<%= app %>'
      },
      dist: {
        options: {
          dest: '<%= dist %>',
          config: '_config.yml'
        }
      },
      serve: {
        options: {
          serve: true,
          dest: '_site',
          future: true
        }
      }
    },

    jasmine: {
      main: {
        options: {
          specs: 'js/test/**/*Spec.js',
          helpers: 'js/test/**/*Helper.js'
        }
      }
    },

    browserify: {
      main: {
        src: ['js/src/**/*.js'],
        dest: 'js/bundle.js'
      },

      test: {
        src: ['js/test/**/*.js'],
        dest: 'js/bundle.js'
      }
    },

    watch: {
      js: {
        files: ['js/src/**/*'],
        tasks: ['browserify:main']
      },

      test: {
        files: ['js/test/**/*'],
        tasks: ['browserify:test']
      }
    }
  });

  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch')

  grunt.registerTask('default', ['jekyll']);
  grunt.registerTask('build', ['browserify:main']);
};
