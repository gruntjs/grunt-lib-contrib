# grunt-contrib-lib
> Common functionality shared across grunt-contrib tasks.

### Helper Functions

#### options(data, defaults)

This helper is on its way out as grunt v0.4 adds an options helper to the task api. This new helper only supports task and target options (no root level options key) so you should start adjusting your tasks now to be ready for the v0.4 release.

Contrib tasks are in the process of being updated to check for the new helper first.

#### findBasePath(srcFiles)

This helper is used to take an array of filepaths and find the common base directory.

#### getNamespaceDeclaration(ns)

This helper is used to build JS namespace declarations.

#### normalizeMultiTaskFiles(data, target)

This helper is a (temporary) shim to handle multi-task `files` object in the same way grunt v0.4 does.

## Release History
* 2012/08/19 - v0.2.2 - added findBasePath. refactored tests. parse templates in options.
* 2012/08/14 - v0.2.1 - Non-destuctive namespace declarations
* 2012/08/10 - v0.2.0 - Refactored from grunt-contrib into individual repo.