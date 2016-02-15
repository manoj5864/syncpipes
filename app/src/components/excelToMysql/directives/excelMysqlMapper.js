import template from "components/excelToMysql/views/excelMysqlMapper.html!text"

let excelMysqlMapper = function(excelService, mysqlService, dataFactory){
    "use strict";

    var control = function($scope, excelService, dataFactory) {
        $scope.init = function() {
            var tables = dataFactory.getTables();
            for(var i=0; i<tables.length; i++)
                getColumns(dataFactory.getDatabase(), tables[i]);

            $scope.tables = dataFactory.getTables();
            $scope.excelSheets = dataFactory.getExcelSheets();
            $scope.objectMapper = excelService.getObjectMapper();
        }
    }

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Connect to Mysql server";

        scope.reset = function() {
            dataFactory.clear();
        };

        scope.createMapping =function() {
            dataFactory.setActiveTab("mapper");
        };

        scope.updateObjectMapper = function(sheet, table) {
            var objectMapper = dataFactory.getObjectMapper();
            for(var i=0; i<objectMapper.length; i++) {
                if(objectMapper[i].from === sheet) {
                    objectMapper[i].to = table;
                    for(var j=0; j<objectMapper[i].attributes.length; j++)
                        objectMapper[i].attributes[j].to = null;
                    // add more logic to update the map automatically here..
                }
            }
            dataFactory.setObjectMapper(objectMapper);
        };

        scope.getExcelColumn = function(sheet) {
            return excelService.getColumnsInExcelSheet(sheet, dataFactory.getExcelJson());
        };

        scope.getTableColumnMap = function(table) {
            return dataFactory.getTableColumnMap()[table];
        };

        scope.updateAttributeMapper = function(sheet, excelColumn, tableColumn) {
            var objectMapper = dataFactory.getObjectMapper();
            for(var i=0; i<objectMapper.length; i++) {
                if(objectMapper[i].from === sheet) {
                    for(var j=0; j<objectMapper[i].attributes.length; j++) {
                        if(objectMapper[i].attributes[j].from === excelColumn)
                            objectMapper[i].attributes[j].to = tableColumn;
                    }
                    // add more logic to update the map automatically here..
                }
            }
            dataFactory.setObjectMapper(objectMapper);
        };

        scope.executeModel = function() {
            dataFactory.setActiveTab("execution");
        };
    };

    var getColumns = function(databaseName, tableName) {
        if (tableName !== undefined && databaseName !== undefined) {
            var options = {};
            options.databaseName = databaseName;
            options.tableName = tableName;
            mysqlService.queryMysql(fixedUrl.getColumns, options).then(function(payload) {
                dataFactory.updateTableColumnMap(tableName, payload); //Field, Type, Null, Key, Default, Extra
                return payload;
            }, function(errorPayload) { alert("Unable to get columns of a table from database!");});
        }
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
            updateObjectMapper: "=",
            updateAttributeMapper: "=",
            getExcelColumn: "=",
            init: "=",
            getTableColumnMap: "="
        },
        controller: control,
        template: template
    };
};

excelMysqlMapper.$inject = ['excelService', 'mysqlService', 'dataFactory'];
export default excelMysqlMapper;
