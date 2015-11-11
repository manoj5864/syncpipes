
// Define the Angular 'view2' View

import angular from 'angular';
import ngRoute from 'angular-route';



const VIEW_2_PATH = '/view2';

import view2Template from 'views/view2/view2.html!text';

function view2Ctrl() {
    "use strict";

}

let moduleName = angular
    .module( 'view2', ['ngRoute' ])
    .config( ($routeProvider) => {

        $routeProvider.when(VIEW_2_PATH, {
            template: view2Template,
            controller: view2Ctrl
        });

    })
    .name;


export default moduleName;
