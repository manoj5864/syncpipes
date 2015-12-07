import angular from 'angular';
import ngRoute from 'angular-route';


import EAToMysqlCtrl from 'components/EAToMysql/EAToMysqlCtrl';
import staticService from 'components/EAToMysql/js/staticService'
import view from 'components/EAToMySql/view/EAToMysql.html!text';
const ROOT_PATH = '/EAToMysql';

let moduleName = angular
    .module("EAToMySql", ['ngRoute'])
    .controller("EAToMysqlCtrl", EAToMysqlCtrl)
    .service("staticService", ['$http', '$q', staticService])
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: EAToMysqlCtrl
        });
    })
    .name;

export default moduleName;