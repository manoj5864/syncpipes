import angular from 'angular';
import ngRoute from 'angular-route';
import version from 'components/version/version' ;
import rootView from 'views/rootView/rootView';

// Define the Angular 'main' module
let moduleName = angular
    .module('main', [ version ,'ngRoute', rootView] )
    .config( ($routeProvider) => {
      $routeProvider.otherwise({redirectTo: '/selectAdapter'});
    }).name;

export default moduleName;