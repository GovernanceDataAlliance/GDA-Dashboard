var rewriteRulesSnippet = require("grunt-connect-rewrite/lib/utils").rewriteRequest;
var serveStatic = require('serve-static');
var stringify = require('stringify');

module.exports = function(grunt) {
  grunt.initConfig({
    jekyll: {
      options: {
        bundleExec: true,
        src : '<%= app %>',
        dest: '<%= dist %>',
        config: '_config.yml'
      },
      dist: { options: {} },
      dev: {
        options: {
          watch: true,
          incremental: true
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
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      countries: {
        src: ['js/src/countries_main.js'],
        dest: 'js/countries_bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      },

      test: {
        src: ['js/test/**/*.js'],
        dest: 'js/test/bundle.js',
        options: {
          transform: [stringify(['.hbs', '.txt', '.sql', '.md'])]
        }
      }
    },

    watch: {
      js: {
        files: ['js/src/**/*'],
        tasks: ['browserify:main', 'browserify:countries']
      },
      jekyll: {
        files: ['js/src/**/*', '**/*.html', 'css/**/*', '_sass/**/*'],
        tasks: ['jekyll:dist']
      }
    },

    clean: {
      test: ['js/test/bundle.js']
    },

    connect: {
      options: {
        debug: true,
        port: 4000,
        base: '_site',
      },
      rules: [
        {from: '(^((?!css|html|js|img|fonts|\/$).)*$)', to: "$1.html"}
      ],
      development: {
        options: {
          middleware: function (connect, options) {
            return [rewriteRulesSnippet, serveStatic(require("path").resolve(options.base[0]))];
          }
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
  grunt.loadNpmTasks("grunt-connect-rewrite");

  grunt.registerTask('build', ['browserify:main', 'browserify:countries', 'jekyll:dist']);
  grunt.registerTask('default', ['build', 'configureRewriteRules', 'connect:development', 'watch']);
  grunt.registerTask('test', ['clean:test', 'browserify:test', 'jasmine']);
};
