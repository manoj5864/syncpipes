import template from "components/excelToMysql/views/excelMysqlMapper.html!text"

let excelMysqlMapper = function(excelService, mysqlService, dataFactory){
    "use strict";

    var control = function($scope, excelService, dataFactory) {
        $scope.init = function() {
			$scope.tables = dataFactory.getTables();
            $scope.excelSheets = dataFactory.getExcelSheets();
            excelService.getObjectMapper(dataFactory);
            $scope.objectMapper = dataFactory.getObjectMapper();
        };

        $scope.$on('objectMapperUpdated', function() {
            $scope.objectMapper = dataFactory.getObjectMapper();
        });
    };

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Connect to Mysql server";

        scope.reset = function() {
            dataFactory.clear();
        };

        scope.createMapping =function() {
            dataFactory.setActiveTab("mapper");
        };

        scope.getExcelColumn = function(sheet) {
            return excelService.getColumnsInExcelSheet(sheet, dataFactory.getExcelJson());
        };

        scope.getTableColumnMap = function(table) {
            var cols= [];
            var temp = dataFactory.getTableColumnMap()[table];
            if(temp !== undefined) {
                for(var i=0; i<temp.length; i++) {
                    cols.push(temp[i].Field);
                }
            }
            return cols;
        };

        scope.executeModel = function() {
            dataFactory.setActiveTab("execution");
        };
    };

    return {
        restrict: 'E',
        link: linker,
        scope: {
            status: "=",
            message: "=",
            reset: "=",
            baseUrl: "=",
            port: "=",
            userName: "=",
            password: "=",
            connectToMysql: "=",
            databases: "=",
            database: "=",
            createDb: "=",
            databaseName: "=",
            createMapping: "=",
            excelSheets: "=",
            tables: "=",
            getExcelColumn: "=",
            init: "=",
            getTableColumnMap: "=",
            objectMapper: "="
        },
        controller: control,
        template: template
    };
};

excelMysqlMapper.$inject = ['excelService', 'mysqlService', 'dataFactory'];
export default excelMysqlMapper;
