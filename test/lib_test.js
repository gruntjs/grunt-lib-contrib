var grunt = require('grunt');
var helper = require('../lib/contrib.js').init(grunt);

exports.lib = {
  findBasePath: function(test) {
    'use strict';
    var path = require('path');

    test.expect(1);

    var actual = helper.findBasePath(['dir1/dir2/dir3/file.js', 'dir1/dir2/another.js', 'dir1/dir2/dir3/dir4/last.js']);
    var expected = path.normalize('dir1/dir2');
    test.equal(expected, actual, 'should detect basePath from array of filepaths.');

    test.done();
  },
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
  options: function(test) {
    'use strict';

    test.expect(4);

    var options = helper.options({nameArgs: 'options_test:subtask'});
    var options_with_default = helper.options({nameArgs: 'options_test:subtask'}, {required: 'default'});

    var actual = options.global;
    var expected = 'set';
    test.equal(expected, actual, 'should get params from global options.options_test key');

    actual = options.setting;
    expected = 'subtask';
    test.equal(expected, actual, 'should let params from global options.options_test.subtask override options.options_test');

    actual = options.param;
    expected = 'override all';
    test.equal(expected, actual, 'should allow task options key to override all others');

    actual = options_with_default.required;
    expected = 'default';
    test.equal(expected, actual, 'should allow task to define default values');

    test.done();
  }
};