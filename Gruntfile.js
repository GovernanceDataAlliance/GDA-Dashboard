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
        src: ['js/src/main.js'],
        dest: 'js/bundle.js',
        options: {
          transform: ['brfs']
        }
      },

      test: {
        src: ['js/test/**/*.js'],
        dest: 'js/test/bundle.js',
        options: {
          transform: ['brfs']
        }
      }
    },

    watch: {
      js: {
        files: ['js/src/**/*'],
        tasks: ['browserify:main']
      },
      jekyll: {
        files: ['*'],
        tasks: ['jekyll:dist']
      }
    },

    clean: {
      test: ['js/test/bundle.js']
    },

    connect: {
      server: {
        options: {
          port: 4000,
          base: '_site'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-jekyll');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('build', ['browserify:main', 'jekyll:dist']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);
  grunt.registerTask('test', ['clean:test', 'browserify:test', 'jasmine']);
};
