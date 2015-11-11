// Load css
import "bootstrap/css/bootstrap.css!"
import "font-awesome/css/font-awesome.css!"
import "main.css!"

// Load Angular libraries
import angular from 'angular'

// Load Bootstrap libraries
import bootstrap from 'bootstrap'

// Load custom application modules
import main from 'app/main'

/**
 * Manually bootstrap the application when AngularJS and
 * the application classes have been loaded.
 */
angular.element(document)
    .ready(function() {
        let appName = 'adapter-app';
        let body = document.getElementsByTagName("body")[0];
        let app  = angular.module( appName, [ main ] );
        angular.bootstrap( body, [ app.name ]);
    });
