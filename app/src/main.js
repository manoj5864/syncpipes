import angular from 'angular';
import ngRoute from 'angular-route';
import rootView from 'views/rootView/rootView';
import excelToMysql from 'components/excelToMysql/excelToMysql';
import EAToMysql from 'components/EAToMysql/EAToMysql';
import jiraToMysql from 'components/jiraToMysql/jiraToMysql';

// Define the Angular 'main' module
let moduleName = angular
    .module('main', [ 'ngRoute', rootView, excelToMysql, EAToMysql, jiraToMysql] )
    .config( ($routeProvider) => {
      $routeProvider.otherwise({redirectTo: '/selectAdapter'});
    }).name;

export default moduleName;