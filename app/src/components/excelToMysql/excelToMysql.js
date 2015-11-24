import angular from 'angular';
import ngRoute from 'angular-route';

import excelToMysqlCtrl from 'components/excelToMysql/excelToMysqlCtrl';
import staticService from 'components/excelToMysql/js/staticService'
import view from 'components/excelToMySql/view/excelToMysql.html!text';
import objectMapperView from 'components/excelToMySql/view/objectMapper.html!text';
const ROOT_PATH = '/excelToMysql';

let moduleName = angular
    .module("excelToMySql", ['ngRoute'])
    .controller("excelToMysqlCtrl", excelToMysqlCtrl)
    .service("staticService", ['$http', '$q', staticService])
    .directive('objectMapper',  function() {
        return { template: objectMapperView };
    })
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: excelToMysqlCtrl,
            css: 'components/excelToMySql/css/excelToMysql.css'
        });
    })
    .name;

export default moduleName;