# ES6-AngularJS
This is another starting project for development of AngularJS Applications using ES6

## Directory Layout

```
app/                    --> all of the source files for the application
  src/                    --> all app specific source files
    components/             --> all app specific modules
      version/                 --> version related components
        version.js                 --> version module declaration and basic "version" value service
        version_test.js            --> "version" value service tests
        version-directive.js       --> custom directive that returns the current app version
        version-directive_test.js  --> version directive tests
        interpolate-filter.js      --> custom interpolation filter
        interpolate-filter_test.js --> interpolate filter tests
    views/                 --> all app specific views    
      view1/                --> the view1 view template and logic
        view1.html            --> the partial template
        view1.js              --> the controller logic
        view1_test.js         --> tests of the controller
      view2/                --> the view2 view template and logic
        view2.html            --> the partial template
        view2.js              --> the controller logic
        view2_test.js         --> tests of the controller
    boot.js                   --> manual bootstraping file 
    main.js                 --> main module 
  config.js                --> main configuration file for systemjs
  index.html            --> app layout file (the main html template file of the app)
karma.conf.js         --> config file for running unit tests with Karma
e2e-tests/            --> end-to-end tests
  protractor-conf.js    --> Protractor config file
  scenarios.js          --> end-to-end scenarios to be run by Protractor
```
