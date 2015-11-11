
// Load the custom app ES6 modules

import angular from 'angular'
import InterpolateFilter from 'components/version/interpolate-filter'
import VersionDirective    from 'components/version/version-directive'


// Define the Angular 'version' module

let moduleName = angular
    .module( "version", [ InterpolateFilter , VersionDirective ])
    .value('version', '0.1')
    .name;

export default moduleName;



