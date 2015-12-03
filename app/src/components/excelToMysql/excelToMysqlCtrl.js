import angular from 'angular';
import "js-xlsx"
import "js-xlsx/dist/cpexcel"

function excelToMysqlCtrl($q, $scope, $location, excelToMysqlService) {
    "use strict";
    var self = this;
    self.excelFile = null;
    self.databases = null;
    self.tables = [];
    self.columns = [];
    self.excelAsJson = [];
    self.excelSheets = [];
    self.objectMapper = [];
    $scope.database = null;
    self.tableColumnMap = {};

    self.init = function() {
        toggleLink("configLink");
    };

    $scope.selectExcelFile = function() {
        var fileInput = document.getElementById('excelFile');
        var file = fileInput.files[0];
        self.excelFile = file;
    };

    $scope.$watch('database', function() {
        if (self.databases != null) {
            for (var i = 0; i < self.databases.length; i++) {
                var db = self.databases[i];
                if (db.Database === $scope.database) {
                    var options = {};
                    options.databaseName = $scope.database;
                    var promise = excelToMysqlService.queryMysql(fixedUrl.getTables, options);
                    promise.then(
                        function(payload) { self.tables = payload; },
                        function(errorPayload) { alert("Unable to get tables!");}
                    );
                }
            }
        }
    });

    self.getColumns = function(databaseName, tableName) {
        if (tableName !== undefined && databaseName !== undefined) {
            var options = {};
            options.databaseName = databaseName;
            options.tableName = tableName;
            var promise = excelToMysqlService.queryMysql(fixedUrl.getColumns, options);
             promise.then(function(payload) {
                 self.tableColumnMap[tableName] = payload; //Field, Type, Null, Key, Default, Extra
                return payload;
             }, function(errorPayload) { alert("Unable to get columns!");});
        }
    }

    self.connectToMysql = function() {
        var options = {};
        options.baseUrl = $scope.baseUrl;
        options.port = $scope.port;
        options.userName = $scope.userName;
        options.password = $scope.password;
        var promise = excelToMysqlService.queryMysql(fixedUrl.mysqlConnectionServer, options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(errorPayload) { alert("Unable to connect to the database!"); }
        );
    };

    self.createADatabase = function() {
        var options = {};
        options.databaseName = $scope.databaseName;
        var promise = excelToMysqlService.queryMysql(fixedUrl.mysqlCreateDB, options);
        promise.then(function(payload) {
            self.connectToMysql();
            alert("Successfully created a new database!");
        }, function(errorPayload) { alert("Unable to connect to the database!");});
    };

    self.createMapping = function(){
        toggleLink("mappingLink");
        $("#config").hide();
        $("#mapper").show();

        for(var i=0; i<self.tables.length; i++)
            self.getColumns($scope.database, self.tables[i]);

        excelToMysqlService.readExcelFile(self.excelFile).then(function(data) {
            if(typeof require !== 'undefined') XLS = require('xlsjs');
            var workbook = XLS.read(data, {type: 'binary'});
            var modelText = "";
            self.excelSheets = workbook.SheetNames;
            self.excelSheets.forEach(function(y) {
                self.excelAsJson.push(excelToMysqlService.toJson(workbook));
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
                        var columnsOfExcel = excelToMysqlService.getColumnsInExcelSheet(sheet, self.excelAsJson);
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
                    var columns = excelToMysqlService.getColumnsInExcelSheet(sheet, self.excelAsJson);
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

    self.updateObjectMapper = function(sheet, table) {
        for(var i=0; i<self.objectMapper.length; i++) {
            if(self.objectMapper[i].from === sheet) {
                self.objectMapper[i].to = table;
                for(var j=0; j<self.objectMapper[i].attributes.length; j++)
                    self.objectMapper[i].attributes[j].to = null;
                // add more logic to update the map automatically here..
            }
        }
    }

    self.updateAttributeMapper = function(sheet, excelColumn, tableColumn) {
        for(var i=0; i<self.objectMapper.length; i++) {
            if(self.objectMapper[i].from === sheet) {
                for(var j=0; j<self.objectMapper[i].attributes.length; j++) {
                    if(self.objectMapper[i].attributes[j].from === excelColumn)
                        self.objectMapper[i].attributes[j].to = tableColumn;
                }
                // add more logic to update the map automatically here..
            }
        }
    }

    self.getExcelColumn = function(sheet) {
        return excelToMysqlService.getColumnsInExcelSheet(sheet, self.excelAsJson);
    }

    self.executeModel = function() {
        toggleLink("executionLink");
        $("#mapper").hide();
        $("#execution").show();
        for(var i=0; i<self.objectMapper.length; i++) {
            var map = self.objectMapper[i];

            //create table
            if(!self.tableColumnMap.hasOwnProperty(map.to)) {
                var cols = [];
                for(var j=0; j<map.attributes.length; j++)
                    cols.push(map.attributes[j].to);
                self.createTable($scope.database, map.to, cols);
            } else {
                //logic to update table and columns if table exist goes here
            }
        }

        sleep(1000);
        //insert row
        for(var i=0; i<self.excelAsJson.length; i++) {
            var sheetAsJson = self.excelAsJson[i];
            var sheet = Object.keys(sheetAsJson)[0];
            var map = self.getMapFromObjectMapper(self.objectMapper, sheet);

            var tableName = map.to;
            var rowsAsJson = sheetAsJson[sheet];

            for(var j=0; j<rowsAsJson.length; j++) {
                var attributes = {};
                var rowAsJson = rowsAsJson[j];
                for(var k=0; k<map.attributes.length; k++) {
                    var aMap = map.attributes[k];
                    attributes[aMap.to] = rowAsJson[aMap.from];
                }
                self.insertRow($scope.database, tableName, attributes);
            }
        }

        sleep(1000);
        $(".log").append("<br /><h3>Execution complete!</h3>");
    }

    self.getMapFromObjectMapper = function(objectMapper, fromObject) {
        for(var i=0; i<self.objectMapper.length; i++)
            if(self.objectMapper[i].from === fromObject) return self.objectMapper[i];
    }

    self.getExcelRowAsJson = function(sheetName) {
        for(var i=0; i<self.excelSheets.length; i++)
            if(self.excelSheets[i].hasOwnProperty(sheetName))
                return self.excelSheets[i][sheetName];
        return null;
    }

    self.createTable = function(databaseName, tableName, cols) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.cols = cols;
        var promise = excelToMysqlService.queryMysql(fixedUrl.createTable, options);
        promise.then(function(payload) {
            $(".log").append(">> Created table " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to create table " + tableName);});
    }

    self.insertRow = function(databaseName, tableName, attributes) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.attributes = attributes;
        var promise = excelToMysqlService.queryMysql(fixedUrl.insertRow, options);
        promise.then(function(payload) {
            $(".log").append(">> New row added to " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to insert row in table " + tableName + "---" + errorPayload);});
    };
}

export default excelToMysqlCtrl;