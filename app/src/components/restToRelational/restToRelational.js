// Load the custom app ES6 modules
import 'canvas/css/canvas.css!css';

import restToRelationalCtrl from 'restToRelational/restToRelationalCtrl';
import view from 'restToRelational/view/restToRelational.html!text';

// Define the Angular 'canvas' module
let moduleName = angular
    .module("restToRelational", [ ] )
    .controller("restToRelationalCtrl", restToRelationalCtrl)
    .directive('restToRelational',  function() {
        return { template: view };
    })
    .name;

export default moduleName;