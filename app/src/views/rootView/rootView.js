
// Define the Angular 'view1' View

import angular from 'angular';
import ngRoute from 'angular-route';

const ROOT_PATH = '/selectAdapter';

import rootViewTemplate from 'views/rootView/rootView.html!text';

function rootViewCtrl() {
    "use strict";
}

let moduleName = angular
    .module('rootView', ['ngRoute'])
    .config( ($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: rootViewTemplate,
            controller: rootViewCtrl
        });
    })
    .name;

export default moduleName;
