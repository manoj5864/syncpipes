import angular from 'angular';
import ngRoute from 'angular-route';

import excelToMysqlCtrl from 'components/excelToMysql/excelToMysqlCtrl';
import excelToMysqlService from 'components/excelToMysql/js/excelToMysqlService'
import view from 'components/excelToMySql/view/excelToMysql.html!text';
const ROOT_PATH = '/excelToMysql';

let moduleName = angular
    .module("excelToMySql", ['ngRoute'])
    .controller("excelToMysqlCtrl", excelToMysqlCtrl)
    .service("excelToMysqlService", ['$http', '$q', excelToMysqlService])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToMysqlCtrl,
            css: 'components/excelToMySql/css/excelToMysql.css'
        });
    })
    .name;

export default moduleName;