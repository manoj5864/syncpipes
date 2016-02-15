import template from "components/excelToMysql/views/excelMysqlMapper.html!text"

let excelMysqlMapper = function(excelService, mysqlService, mysqlDataFactory, dataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        var self = this;

        scope.status = 'empty';
        scope.message = "Connect to Mysql server";

        scope.init = function() {
            for(var i=0; i<self.tables.length; i++)
                self.getColumns(dataFactory.getDatabase(), self.tables[i]);

            excelService.readExcelFile(self.excelFile).then(function(data) {
                if(typeof require !== 'undefined') XLS = require('xlsjs');
                var workbook = XLS.read(data, {type: 'binary'});
                self.excelSheets = workbook.SheetNames;
                self.excelSheets.forEach(function(y) {
                    self.excelAsJson.push(excelService.toJson(workbook));
                });

                for(var i=0; i<self.excelSheets.length; i++) {
                    var sheet = self.excelSheets[i];
                    var hasMatchingTable = false;
                    for (var j = 0; i < self.tables.length; i++) {
                        var table = self.tables[j];
                        if (sheet == table) {
                            hasMatchingTable = true;
                            var map = {};
                            map.from = sheet;
                            map.to = table;
                            var columnsOfExcel = excelService.getColumnsInExcelSheet(sheet, self.excelAsJson);
                            var columnsOfTable = self.getColumns($scope.database, table);
                            map.attributes = [];

                            for(var coe in columnsOfExcel) {
                                var aMap = {};
                                aMap.from = coe;
                                for (var cot in columnsOfTable) {
                                    if (cot === coe) {
                                        aMap.to = cot;
                                        break;
                                    }
                                }
                                map.attributes.push(aMap);
                            }
                            self.objectMapper.push(map);
                        }
                    }
                    if(!hasMatchingTable) {
                        var map = {};
                        map.from = sheet; map.to = sheet;
                        var columns = excelService.getColumnsInExcelSheet(sheet, self.excelAsJson);
                        map.attributes = [];
                        for(var i=0; i<columns.length; i++) {
                            var aMap = {};
                            aMap.from = columns[i]; aMap.to = columns[i];
                            map.attributes.push(aMap);
                        }
                        self.objectMapper.push(map);
                    }
                }
            });
        };

        scope.reset = function() {
            mysqlDataFactory.clear();
        };

        scope.createMapping =function() {
            dataFactory.setActiveTab("mapper");
        };

        self.getColumns = function(databaseName, tableName) {
            if (tableName !== undefined && databaseName !== undefined) {
                var options = {};
                options.databaseName = databaseName;
                options.tableName = tableName;
                excelService.queryMysql(fixedUrl.getColumns, options).then(function(payload) {
                    dataFactory.updateTableColumnMap(tableName, payload); //Field, Type, Null, Key, Default, Extra
                    return payload;
                }, function(errorPayload) { alert("Unable to get columns of a table from database!");});
            }
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
            createMapping: "="
        },
        template: template
    };
};

excelMysqlMapper.$inject = ['excelService', 'mysqlService', 'mysqlDataFactory', 'dataFactory'];
export default excelMysqlMapper;
