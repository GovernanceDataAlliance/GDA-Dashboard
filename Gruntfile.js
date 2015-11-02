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
          specs: 'js/test/bundle.js',
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
        dest: 'js/test/bundle.js'
      }
    },

    watch: {
      js: {
        files: ['js/src/**/*'],
        tasks: ['browserify:main']
      }
    },

    clean: {
      test: ['js/test/bundle.js']
    }
  });

  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jekyll']);
  grunt.registerTask('build', ['browserify:main']);
  grunt.registerTask('test', ['clean:test', 'browserify:test', 'jasmine']);
};
