# AwesomeComponenets Release Notes

#### **Version 1.0.0**

 - Documentation Editing

 - Adds API documentation.

 - Adds JSDOC to Zeph.js source code.

 - Fixes broken documentation links.

 - ZephService documentation.

 - Fixes a bug which might cause events on ZephServices to emit twice.

 - Renames ZephElementObserver to ZephObserver.

 - Fixes broken regression test.

#### **Version 0.5.0**

 - Updates to documentation to make ZephJS more user focused.

 - Remove ZephServices.

 - Adds minor log information to serve cli command.

 - Fixes inheritance bug with inherited context not being copied correctly.

 - Adds alias() definition method.

 - serve cli command now will serve Zeph.js from src.

#### **Version 0.4.2**

 - Moved Rollup and Acorn into dependencies for devDependencies.

#### **Version 0.4.1**

 - Fixing zeph command line tool to correctly start.

 - Fixing some minor linting issues.

#### **Version 0.4.0**

 - **BREAKING CHANGE**: You should now use `./zeph.min.js` or `./zeph.full.js` in your code instead of `./src/Zeph.js`.

 - Adds minification.
   - Updated cli with new options and minification usage.
   - Adds minify package to dependencies.
   - Updates documentation for minification.

 - Reduced code footprint. Adds better checking when resolving url names.

 - Adds onProperty() lifecycle event and associated tests.

Fixed a pending promise resolution bug on components that inherit using from().

#### **Version 0.3.1**

 - Fixes bug with fetchText returning undefined when fetch content is empty.

 - Fixes bug with document.createElement() not working with ZephComponents.

 - Changed language around Mistral in readme.

#### **Version 0.3.0**

 - adds component inheritance via from().

 - adds options to html() and css():
   - overwrite: to overwrite html content instead of appending
   - noRemote: to disable attempting to remotely find content.

 - Refactor not functions to be more expressive.

 - Exposes ZephUtils and added ZephUtils.ready().

 - Fixes bug in onAttribute() not firing.

 - Updated tests and adds inheritance test.

 - Locks dependency versions.

 - Adds feature list to readme.

 - Add Browser Compatability table to readme.

 - Add documentation references to zephjs-loading and zephjs-router.

 - Updates documentation for onAttribute to reflect correct handler signature.

 - Adds CLI information to documentation.

 - Minor inline documentation changes for the CLI tools.

#### **Version 0.2.0**

 - Bundle now uses rollup.js and works with new ES Module structure.

 - Fixes bug in lifecycle events firing incorrectly.

 - Zeph CLI now shows help is no sub-command provided.

#### **Version 0.1.1**

 - Fixes broken reference to AwesomeUtils.

#### **Version 0.1.0**

 - Beta release and ongoing development work.

 - Refactored to use ES Modules.

 - Adds attribute() and property().

 - Restructured bindings to just bind() and bindAt().

 - Revapmped documentation greatly.

 - Updated tests for new structure.

#### **Version 0.0.1**

 - Alpha release and ongoing development work.
