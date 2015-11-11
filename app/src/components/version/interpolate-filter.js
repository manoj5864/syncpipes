
// Define the Angular 'interpolate-filter' module

let moduleName = angular
    .module( "interpolate-filter", [])
    .filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .name;

export default moduleName;


