import angular from 'angular';
import ngRoute from 'angular-route';
import "components/excelToMysql/services/excelObjectMapper";
import "components/excelToSC/js/sc-angular";
import excelToSCCtrl from 'components/excelToSC/controllers/excelToSCCtrl';
import excelSCDataFactory from 'components/excelToSC/services/excelSCDataFactory';
import scSelectWorkspace from 'components/excelToSC/directives/scSelectWorkspace';
import view from 'components/excelToSC/views/excelToSC.html!text';
const ROOT_PATH = '/excelToSC';

let moduleName = angular
    .module("excelToSC", ['ngRoute', 'excelToMySql', 'sociocortex'])
    .controller("excelToSCCtrl", ['$rootScope', 'excelSCDataFactory', excelToSCCtrl])
    .factory("excelSCDataFactory", ['$rootScope', excelSCDataFactory])
    .directive("scSelectWorkspace", ['$rootScope', 'excelSCDataFactory', 'scCrud', scSelectWorkspace])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToSCCtrl,
            css: 'components/excelToSC/css/excelToSC.css'
        });
    })
    .name;

export default moduleName;