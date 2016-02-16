import angular from 'angular';
import ngRoute from 'angular-route';
import rootView from 'views/rootView/rootView';
import excelToMysql from 'components/excelToMysql/excelToMysql';
import excelToSC from 'components/excelToSC/excelToSC';
import EAToMysql from 'components/EAToMysql/EAToMysql';
import jiraToMysql from 'components/jiraToMysql/jiraToMysql';
import dataFactories from 'app/dataFactories';

import 'angular-ui-bootstrap';

// Define the Angular 'main' module
let moduleName = angular
    .module('main', [ 'ngRoute', 'ui.bootstrap', rootView, excelToMysql, EAToMysql, jiraToMysql, excelToSC])
    .factory("dataFactories", ['dataFactory', 'excelSCDataFactory', dataFactories])
    .config( ($routeProvider) => {
      $routeProvider.otherwise({redirectTo: 'selectAdapter'});
    }).name;

export default moduleName;