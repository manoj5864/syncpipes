import angular from 'angular';
import ngRoute from 'angular-route';

import excelToMySqlCtrl from 'components/excelToMySql/excelToMySqlCtrl';
import view from 'components/excelToMySql/view/excelToMySql.html!text';
const ROOT_PATH = '/excelToMysql';

let moduleName = angular
    .module("excelToMySql", ['ngRoute'])
    .controller("excelToMySqlCtrl", excelToMySqlCtrl)
    .config( ($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToMySqlCtrl
        });
    })
    .name;

export default moduleName;