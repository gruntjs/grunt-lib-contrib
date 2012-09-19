module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    options: {
      options_test: {
        param: 'default',
        setting: 'set',
        global: 'set',
        subtask: {
          setting: 'subtask'
        }
      }
    },

    options_test: {
      subtask: {
        options: {
          param: 'override all'
        }
      }
    },

    lint: {
      all: ['grunt.js', 'lib/*.js', '<config:test.tasks>']
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    },

    // Unit tests.
    test: {
      tasks: ['test/*_test.js']
    }
  });

  // By default, lint and run all tests.
  grunt.registerTask('default', 'lint test');
};