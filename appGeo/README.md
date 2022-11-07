# Summary of Updates
  Created the NativeScript Angular base template
  Enabled strictTemplates on angularCompilerOptions
  Created tests folder
  Added angularcli functinality

  Main work will surround adding components to our app,

  Components will be in the /src/app folder
  Unit tests will be written in the /src/tests folder

Stuff added is as follows:

# Installed the nativescript-geolocation plugin
  The plugin will be our mode to recieve the player location data

  In order to use in TypeScript pages:
    import * as geolocation from "nativescript-geolocation";
    import { Accuracy } from "tns-core-modules/ui/enums"; // used to describe at what accuracy the location should be get

  In order to use in JavaScript pages:
    var geolocation = require("nativescript-geolocation");

  Permission requests are done with:
    geolocation.enableLocationRequest();

  A call example for a location with high Accuracy:
    geolocation.getCurrentLocation({ desiredAccuracy: Accuracy.high, maximumAge: 5000, timeout: 20000 })


For more info on the plugin go to: https://market.nativescript.org/plugins/nativescript-geolocation/
Generally wanted plugins can be found in the official NativeScript Market place: https://market.nativescript.org/


# Added the test files
  There is now a test folder in /src
  Inside there is an example file of how the tests look like with QUnit

  When creating tests for a new or existing functionality, keep in mind the following specifics:
    -You need to create your tests as JavaScript files in the app/tests directory. The NativeScript CLI recognizes JavaScript files stored in app/tests as unit tests.
    -You need to write tests which comply with the testing framework specification you have chosen for the project.
    -You need to export the functionality that you want to test in the code of your NativeScript project.
    -You need to require the module which exposes the functionality that you want to test in the code of your unit tests.

  When creating tests for a new or existing functionality, keep in mind the following limitations.
    -You cannot require the file or module in which application.start() is called.
    -You cannot use more than one testing framework per project.
    -You cannot test styling and UI which are not applied or created via JavaScript.

More on writing/running tests at: https://docs.nativescript.org/development-workflow.html#write-your-tests
More on QUnit found at: https://qunitjs.com/

Note from NS when placing test files:
  @nativescript/unit-test-runner was included in "dependencies" as a convenience to automatically adjust your app's Info.plist on iOS and AndroidManifest.xml on Android to ensure the socket connects properly.

  For production you may want to move to "devDependencies" and manage the settings yourself

# Angular CLI was added
  To generate new components in the future use
    'ng generate component <name>'
  Similar logic is used for modules:
    'ng generate module <name>'
Here is an overview of how components work in angular documentation:
  https://angular.io/guide/component-overview
Here is an explanation on what angular is and how it works:
  https://angular.io/guide/what-is-angular


# Running test files 
You would need to configure project for unit testing on the testing framework we're using, QUnit. Run the command:

```
tns test init --framework qunit
```

Then to run the tests (which are located in appGeo/src/tests), run one of the following commands 

```
tns test ios
tns test android
```

# ----- Located below is the raw README documentation provided by NativeScript:

# NativeScript Core with TypeScript Blank Template
App templates help you jump start your native cross-platform apps with built-in UI elements and best practices. Save time writing boilerplate code over and over again when you create new apps.

## Quick Start
Execute the following command to create an app from this template:

```
ns create my-blank-ts --template @nativescript/template-blank-ts
```

> Note: This command will create a new NativeScript app that uses the latest version of this template published to [npm](https://www.npmjs.com/package/@nativescript/template-blank-ts).

If you want to create a new app that uses the source of the template from the `master` branch, you can execute the following:

```
# clone nativescript-app-templates monorepo locally
git clone git@github.com:NativeScript/nativescript-app-templates.git

# create app template from local source (all templates are in the 'packages' subfolder of the monorepo)
ns create my-blank-ts --template nativescript-app-templates/packages/template-blank-ts
```

**NB:** Please, have in mind that the master branch may refer to dependencies that are not on NPM yet!

## Walkthrough

### Architecture
The application root module:
- `/app/app-root` - sets up a Frame that lets you navigate between pages.

There is a single blank page module that sets up an empty layout:
- `/app/home/home-page`

**Home** page has the following components:
- `ActionBar` - It holds the title of the page.
- `GridLayout` - The main page layout that should contains all the page content.

## Get Help
The NativeScript framework has a vibrant community that can help when you run into problems.

Try [joining the NativeScript community Discord](https://nativescript.org/discord). The Discord channel is a great place to get help troubleshooting problems, as well as connect with other NativeScript developers.

If you have found an issue with this template, please report the problem in the [NativeScript repository](https://github.com/NativeScript/NativeScript/issues).


