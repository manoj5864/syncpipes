import angular from 'angular';
import ngRoute from 'angular-route';
import "components/excelToMysql/services/excelObjectMapper";
import excelToMysqlCtrl from 'components/excelToMysql/controllers/excelToMysqlCtrl';
import excelService from 'components/excelToMysql/services/excelService';
import mysqlService from 'components/excelToMysql/services/mysqlService';
import dataFactory from 'components/excelToMysql/services/dataFactory';
import excelSelect from 'components/excelToMysql/directives/excelSelect';
import mysqlConfig from 'components/excelToMysql/directives/mysqlConfig';
import excelMysqlMapper from 'components/excelToMysql/directives/excelMysqlMapper';
import excelMysqlTransformer from 'components/excelToMysql/directives/excelMysqlTransformer';
import view from 'components/excelToMySql/views/excelToMysql.html!text';
const ROOT_PATH = '/excelToMysql';

let moduleName = angular
    .module("excelToMySql", ['ngRoute'])
    .controller("excelToMysqlCtrl", ['$rootScope', 'dataFactory', excelToMysqlCtrl])
    .service("excelService", ['$q', excelService])
    .service("mysqlService", ['$http', '$q', mysqlService])
    .factory("dataFactory", ['$rootScope', dataFactory])
    .directive("excelSelect", ['excelService', 'dataFactories', excelSelect])
    .directive("mysqlConfig", ['mysqlService', 'dataFactory', '$rootScope', mysqlConfig])
    .directive("excelMysqlMapper", ["excelService", 'mysqlService', 'dataFactory', excelMysqlMapper])
    .directive("excelMysqlTransformer", ["mysqlService", 'dataFactory', excelMysqlTransformer])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToMysqlCtrl,
            css: 'components/excelToMySql/css/excelToMysql.css'
        });
    })
    .name;

export default moduleName;