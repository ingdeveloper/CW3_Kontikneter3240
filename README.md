Table of Contents
=================


[Setting up the development environment](#SettingUp)


<a name="SettingUp"></a>Setting up the development environment
==============================================================

Prerequisites
-------------

Install node.js from [nodejs.org](http://nodejs.org/). **Make sure it works for the regular user and the Administrative elevated user**. 
To test it, open up a console (cmd) with and without administrative rights and run `npm`. If you get an error that it's not found, you need to install it again using the elevated/non elevated permissions.

Open up a console and go to the Web folder. After you are in the folder, run the following commands on the command line:

`npm install`

`npm install -g gulp`


It should take a while to complete and you should see a lot of messages in the console.

After it is installed, you can open up the solution in Visual Studio and do a 'Rebuild All' on the project. If you don't get any gulp errors, it means everything is correctly installed.

Project development pipeline
============================

The solution contains two implementations that share the same code

- Single Page Application framework (SPA) - based on Durandal
- Standalone component framework

The SPA framework provides support for a complete application that runs solely in the browser after it is loaded. This approach is more heavy-weight but it has the benefit of leveraging the Durandal framework
lifetime events, allowing the developers to create pages and reusable widgets that can have advanced initialization steps. Also the Durandal framework provides a powerfull client-side (browser) routing engine
which allows switching between pages directly in the browser without the need to do server-side page load requests, resulting in a much faster and smoother interactive experience.

The standalone component framework is a light-weight implementation that can be used in the i4SCADA Smart Editor and in light-weight web sites that need to integrate WEBfactory SCADA HTML components. The standalone 
framework contains a set of reusable components that can be placed on the pages, but does not offer any of the lifetime and routing capabilities of Durandal. The advantage of using this framework is the
reduced size and reduced set of dependencies.

The two implmentations are contained in the same solution structure and there are integrated gulp commands which allow preparing, using and deploying the project. Both frameworks use an optimized bundling system
which combines all 3rd party scripts and CSS fiels into a small number of bundles which are compressed in order to accelerate the startup time and to lower the bandwidth requirements of the application.

There are two build configurations for each of the implementations that can be switched easily:
- debug configuration (the application loads each application script independently)
- release configuration (the application implementation is bundled into a single file that is loaded once)

The debug configuration has the advantage of being processed faster and makes the debugging process easier (using the Chrome developer tools for example), while the release configuration is designed for 
deployment scenarios where the size, loading speed and bandwidth must be optimized.

In the end both configurations produce the same visual result, but choosing one or the other affects the development and debugging process.

There are 4 implmementation/build configuration pairs that are supported by the project:

- **`debug-app`** (SPA implementation, debug mode)
- **`release-app`** (SPA implementation, release mode)
- **`debug-standalone`** (standalone component implementation, debug mode)
- **`release-standalone`** (standalone component implementation, release mode)


Development commands
====================

There are a series of gulp tasks that can be run from the command line or using the Task Runner Explorer in Visual Studio (this requires installing the free 'Grunt Launcher' Visual Studio extension - 
[https://visualstudiogallery.msdn.microsoft.com/dcbc5325-79ef-4b72-960e-0a51ee33a0ff](https://visualstudiogallery.msdn.microsoft.com/dcbc5325-79ef-4b72-960e-0a51ee33a0ff) ) which allow building, cleaning and publishing 
parts of or the whole application.

`gulp watch`
-------------

Monitors the application files and automatically triggers tasks for bundling scripts, CSS files or the entire application.
This tasks combines serveral more specialized tasks:

- **`gulp watch-index`** - automatically rebuilds the index.html files when the templates are changed
- **`gulp watch-scripts`** - automatically rebuilds the Javascript bundles when the files in the "Scripts" folder are changed
- **`gulp watch-content`** - automatically rebuilds the CSS bundles when any CSS file in the "Content" folder is changed
- **`gulp watch-app`** - automatically bundles the application when any file is changed in the "App/src" folder

During the development process the entire `gulp watch` or only the specific commands that monitor and handle each section can be started. Once started, the command prompt console or Task Runner Explorer console must be left running in 
order to keep the watcher alive. 

*Note* - the watcher has the limitation that it doesn't monitor newly added files. If a file is added after the watch command has been started, the watch must be restarted in order to take the new file into consideration. This can be done by closing 
the console window and reopening it.
*Note 2* - sometimes the watchers stop working due to internal issues. If that is the case and files are no longer updated, the watcher must be restarted.

`gulp build`
-------------

Runs a full build of all the bundles. This tasks combines several more specialized tasks:

- **`gulp build-index`** - transforms the index file templates located in the `_pageTemplates` folder and generates one `index-CONFIGURATIONNAME.html` for each implementation and build configuration pair
- **`gulp build-app-bundles`** - builds the application release bundles for both implementations in the `App/dist` folder. Each bundle is a single file containing combining all the Javascript and HTML files that are needed for the specific implementation from the `App/src` folder structure.
- **`gulp build-script-bundles`** - builds the script bundles by combining the Javascript files from the `Scripts` folder into a small number of bundled files. These are the 3rd party dependencies necessary for the applications to run correctly.
- **`gulp build-content-bundles`** - builds the CSS bundles and then combining all CSS files under the `Content` folder into a small number of bundled files. These are necessary to obtain the look & feel of the components and the application.


`gulp clean`
-------------

Cleans (deletes) all of the generated bundles. This task combines several more specialized tasks:

- **`gulp clean-index`** - removes all generated index files
- **`gulp clean-app-bundles`** - removes all application release bundles
- **`gulp clean-script-bundles`** - removes all script bundles
- **`gulp clean-content-bundles`** - removes all CSS bundles

`gulp set-index --configuration=configurationname [--force=true]`
--------------------------------------------------------------------------

Activates one of the four possible configurations by setting the corresponding index file as active. `configurationname` must be one of the following:

- **`debug-app`** (SPA implementation, debug mode)
- **`release-app`** (SPA implementation, release mode)
- **`debug-standalone`** (standalone component implementation, debug mode)
- **`release-standalone`** (standalone component implementation, release mode)

The `--force` parameter is optional. If not specified or `false` and an index.html file already exists, the `set-index` command will not overwrite the
existing index file. If set to `true` then the `set-index` command will replace the existing index file with the one for the specified configuration.

The `set-index` command will automatically run also the `build-index` task.


`gulp publish-standalone`
----------------------------

Copies the minimum set of files that are necessary for running a standalone application in release mode. 
The files are copied to the Solution\\**releases\version\standalone** folder. This command will also execute the `gulp clean-standalone` task which will
remove any existing files in the target folder before deploying the new ones.

`gulp clean-standalone`
--------------------------

Remove any existing files in the Solution\\**releases\version\standalone** folder, if it exists.

`gulp publish-app`
----------------------------

Copies a set of files that are necessary for running the Single Page Application in release mode. 
The files are copied to the Solution\\**releases\version\app** folder. This command will also execute the `gulp clean-app` task which will
remove any existing files in the target folder before deploying the new ones.

`gulp clean-app`
--------------------------

Remove any existing files in the Solution\\**releases\version\app** folder, if it exists.