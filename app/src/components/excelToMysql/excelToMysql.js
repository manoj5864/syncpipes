import angular from 'angular';
import ngRoute from 'angular-route';

import excelToMysqlCtrl from 'components/excelToMysql/excelToMysqlCtrl';
import staticService from 'components/excelToMysql/js/staticService'
import view from 'components/excelToMySql/view/excelToMysql.html!text';
const ROOT_PATH = '/excelToMysql';

let moduleName = angular
    .module("excelToMySql", ['ngRoute'])
    .controller("excelToMysqlCtrl", excelToMysqlCtrl)
    .service("staticService", ['$http', '$q', staticService])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToMysqlCtrl
        });
    })
    .name;

export default moduleName;