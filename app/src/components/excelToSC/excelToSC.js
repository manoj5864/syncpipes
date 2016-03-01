import angular from 'angular';
import ngRoute from 'angular-route';
import ngStorage from 'ngStorage';
import ngResource from 'angular-resource';
import "components/excelToMysql/services/excelObjectMapper";
import "components/excelToSC/js/sc-angular";
import excelToSCCtrl from 'components/excelToSC/controllers/excelToSCCtrl';
import excelSCDataFactory from 'components/excelToSC/services/excelSCDataFactory';
import scSelectWorkspace from 'components/excelToSC/directives/scSelectWorkspace';
import scCreateWorkspace from 'components/excelToSC/directives/scCreateWorkspace';
import excelScMapper from 'components/excelToSC/directives/excelScMapper';
import excelScTransformer from 'components/excelToSC/directives/excelScTransformer';
import view from 'components/excelToSC/views/excelToSC.html!text';
const ROOT_PATH = '/excelToSC';

let moduleName = angular
    .module("excelToSC", ['ngRoute', 'excelToMySql', 'ngStorage', 'ngResource', 'sociocortex'])
    .factory("excelSCDataFactory", ['$rootScope', excelSCDataFactory])
    .controller("excelToSCCtrl", ['$rootScope', 'excelSCDataFactory', excelToSCCtrl])
    .directive("scSelectWorkspace", ['excelSCDataFactory', 'scAuth', 'scModel', 'scData', scSelectWorkspace])
    .directive("scCreateWorkspace", ['excelSCDataFactory', 'scAuth', 'scData', scCreateWorkspace])
    .directive("excelScTransformer", ['excelSCDataFactory', 'scAuth', 'scModel', 'scData', excelScTransformer])
    .directive("excelScMapper", ['$rootScope', 'excelSCDataFactory', 'excelService', excelScMapper])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToSCCtrl,
            css: 'components/excelToSC/css/excelToSC.css'
        });
    })
    .name;

export default moduleName;