import angular from 'angular';
import ngRoute from 'angular-route';

import EAToMysqlCtrl from 'components/EAToMysql/controllers/EAToMysqlCtrl';
import staticService from 'components/EAToMysql/services/staticService';
import jsonDataFactory from 'components/EAToMysql/services/jsonDataFactory';
import objectMapperFactory from 'components/EAToMysql/services/objectMapperFactory';
import uploadService from 'components/EAToMysql/services/uploadService';
import view from 'components/EAToMySql/views/EAToMysql.html!text';
import fileSelect from 'components/EAToMySql/directives/fileSelect';
import attrMapper from 'components/EAToMySql/directives/attrMapper';
import mapper from 'components/EAToMySql/directives/mapper';

const ROOT_PATH = '/EAToMysql';

let moduleName = angular
    .module("EAToMySql", ['ngRoute'])
    .service("staticService", ['$http', '$q', staticService])
    .controller("EAToMysqlCtrl", EAToMysqlCtrl)
    .factory("jsonDataFactory", jsonDataFactory)
    .factory("objectMapperFactory", ['staticService', objectMapperFactory])
    .service("uploadService",['$http','$q', 'jsonDataFactory', uploadService])
    .directive("fileSelect",['uploadService','jsonDataFactory', fileSelect])
    .directive("mapper",['staticService','jsonDataFactory', 'objectMapperFactory', mapper])
    .directive("attrMapper",['staticService','jsonDataFactory','objectMapperFactory', attrMapper])


    .config(($routeProvider) => {
        $routeProvider.when( ROOT_PATH, {
            template: view,
            controller: EAToMysqlCtrl
        });
    })
    .name;

export default moduleName;
