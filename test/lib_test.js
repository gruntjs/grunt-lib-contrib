var grunt = require('grunt');
var helper = require('../lib/contrib.js').init(grunt);

exports.lib = {
  getNamespaceDeclaration: function(test) {
    'use strict';

    test.expect(10);

    // Both test should result in this[JST]
    var expected = {
      namespace: 'this["JST"]',
      declaration: 'this["JST"] = this["JST"] || {};'
    };

    var actual = helper.getNamespaceDeclaration("this.JST");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    actual = helper.getNamespaceDeclaration("JST");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    // Templates should be declared globally if this provided
    expected = {
      namespace: "this",
      declaration: ""
    };

    actual = helper.getNamespaceDeclaration("this");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    // Nested namespace declaration
    expected = {
      namespace: 'this["GUI"]["Templates"]["Main"]',
      declaration:  'this["GUI"] = this["GUI"] || {};\n' +
                    'this["GUI"]["Templates"] = this["GUI"]["Templates"] || {};\n' +
                    'this["GUI"]["Templates"]["Main"] = this["GUI"]["Templates"]["Main"] || {};'
    };

    actual = helper.getNamespaceDeclaration("GUI.Templates.Main");
    test.equal(expected.namespace, actual.namespace, 'namespace incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration incorrect');

    // Namespace that contains square brackets
    expected = {
      namespace: 'this["main"]["[test]"]["[test2]"]',
      declaration: 'this["main"] = this["main"] || {};\n' +
                   'this["main"]["[test]"] = this["main"]["[test]"] || {};\n' +
                   'this["main"]["[test]"]["[test2]"] = this["main"]["[test]"]["[test2]"] || {};'
    };

    actual = helper.getNamespaceDeclaration("main.[test].[test2]");
    test.equal(expected.namespace, actual.namespace, 'namespace with square brackets incorrect');
    test.equal(expected.declaration, actual.declaration, 'namespace declaration with square brackets incorrect');

    test.done();
  },
  stripPath: function(test) {
    'use strict';
    var path = require('path');

    test.expect(4);

    var actual = helper.stripPath('path1/path2', 'path1');
    var expected = 'path2';
    test.equal(expected, actual, 'should strip path from a directory path and trim it.');

    actual = helper.stripPath('path1/path2/path3/path4', 'path1/path2');
    expected = path.normalize('path3/path4');
    test.equal(expected, actual, 'should strip path from a directory path and trim it. (deep)');

    actual = helper.stripPath('path1/file.ext', 'path1');
    expected = 'file.ext';
    test.equal(expected, actual, 'should strip path from a file path and trim it.');

    actual = helper.stripPath('path1/path2/path3/path4/file.ext', 'path1/path2');
    expected = path.normalize('path3/path4/file.ext');
    test.equal(expected, actual, 'should strip path from a file path and trim it. (deep)');

    test.done();
  },
  minMaxInfo: function(test) {
    'use strict';
    test.expect(3);

    var max = new Array(100).join('blah ');
    var min = max.replace(/\s+/g, '');

    var actual;
    var expected;

    grunt.util.hooker.hook(grunt.log, 'writeln', {
      pre: function(result) {
        actual += grunt.log.uncolor(result) + grunt.util.linefeed;
        return grunt.util.hooker.preempt();
      }
    });

    grunt.util.hooker.hook(grunt.log, 'write', {
      pre: function(result) {
        actual += grunt.log.uncolor(result);
        return grunt.util.hooker.preempt();
      }
    });


    // No reporting option
    actual = '';
    expected = '';

    helper.minMaxInfo(min, max);
    test.equal(expected, actual, 'should not have reported min and max info.');

    // Report minification results
    actual = '';
    expected = [
      '495 B → 396 B'
    ].join(grunt.util.linefeed) + grunt.util.linefeed;

    helper.minMaxInfo(min, max, 'min');
    test.equal(expected, actual, 'should have logged min and max info.');

    // Report minification and gzip results
    actual = '';
    expected = [
      '495 B → 396 B → 36 B (gzip)'
    ].join(grunt.util.linefeed) + grunt.util.linefeed;

    helper.minMaxInfo(min, max, 'gzip');
    test.equal(expected, actual, 'should have logged min, max, gzip info.');

    grunt.util.hooker.unhook(grunt.log, 'writeln');
    grunt.util.hooker.unhook(grunt.log, 'write');
    test.done();
  }
};
