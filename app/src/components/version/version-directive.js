

// Define the Angular 'version-directive' module

let moduleName = angular
    .module( "version-directive", [])
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])
    .name;

export default moduleName;


