import angular from 'angular';
import ngRoute from 'angular-route';

import excelToMysqlCtrl from 'components/excelToMysql/controllers/excelToMysqlCtrl';
import excelService from 'components/excelToMysql/services/excelService';
import mysqlService from 'components/excelToMysql/services/mysqlService';
import excelUploadService from 'components/excelToMysql/services/excelUploadService';
import excelDataFactory from 'components/excelToMysql/services/excelDataFactory';
import dataFactory from 'components/excelToMysql/services/dataFactory';
import mysqlDataFactory from 'components/excelToMysql/services/mysqlDataFactory';
import excelSelect from 'components/excelToMysql/directives/excelSelect';
import mysqlConfig from 'components/excelToMysql/directives/mysqlConfig';
import excelMysqlMapper from 'components/excelToMysql/directives/excelMysqlMapper';
import view from 'components/excelToMySql/views/excelToMysql.html!text';
const ROOT_PATH = '/excelToMysql';

let moduleName = angular
    .module("excelToMySql", ['ngRoute'])
    .controller("excelToMysqlCtrl", excelToMysqlCtrl)
    .service("excelService", ['$q', excelService])
    .service("mysqlService", ['$http', '$q', mysqlService])
    .factory("excelDataFactory", ['$rootScope', excelDataFactory])
    .factory("dataFactory", ['$rootScope', dataFactory])
    .factory("mysqlDataFactory", ['$rootScope', mysqlDataFactory])
    .service("excelUploadService", ['$q', 'excelService', 'excelDataFactory', excelUploadService])
    .directive("excelSelect", ['excelUploadService', 'excelDataFactory', excelSelect])
    .directive("mysqlConfig", ['mysqlService', 'mysqlDataFactory', 'dataFactory', mysqlConfig])
    .directive("excelMysqlMapper", ['mysqlService', 'mysqlDataFactory', 'dataFactory', excelMysqlMapper])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToMysqlCtrl,
            css: 'components/excelToMySql/css/excelToMysql.css'
        });
    })
    .name;

export default moduleName;