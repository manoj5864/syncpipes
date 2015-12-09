import angular from 'angular';
import ngRoute from 'angular-route';

import EAToMysqlCtrl from 'components/EAToMysql/controllers/EAToMysqlCtrl';
import staticService from 'components/EAToMysql/services/staticService';
import uploadService from 'components/EAToMysql/services/uploadService';
import view from 'components/EAToMySql/views/EAToMysql.html!text';
import fileSelect from 'components/EAToMySql/directives/fileSelect';

const ROOT_PATH = '/EAToMysql';

let moduleName = angular
    .module("EAToMySql", ['ngRoute'])
    .service("staticService", ['$http', '$q', staticService])
    .service("uploadService", [uploadService])
    .directive('fileSelect',['uploadService', fileSelect])
    .controller("EAToMysqlCtrl", EAToMysqlCtrl)
    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: EAToMysqlCtrl
        });
    })
    .name;

export default moduleName;