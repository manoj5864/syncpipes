import angular from 'angular';
import "js-xlsx"
import "js-xlsx/dist/cpexcel"

function excelToMysqlCtrl($q, $scope, $location, staticService) {
    "use strict";
    var self = this;
    self.databases = null;
    self.tables = [];
    self.columns = [];
    self.excelAsJson = [];
    self.excelSheets = [];
    self.objectMapper = [];
    $scope.database = null;

    self.init = function() {
        toggleLink("configLink");
    };

    self.excelFile = null;
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
                    var promise = staticService.getTables(options);
                    promise.then(
                        function(payload) {
                            self.tables = payload;
                        },
                        function(errorPayload) { alert("Unable to get tables!");}
                    );
                }
            }
        }
    });

    self.getColumns = function() {
        var options = {};
        options.databaseName = $scope.database;
        options.tableName = $scope.tableName;
        var promise = staticService.getColumns(options);
        promise.then(
            function(payload) {console.log(payload);},
            function(errorPayload) { alert("Unable to get columns!");}
        );
    }

    self.connectToMysql = function() {
        var options = {};
        options.baseUrl = $scope.baseUrl;
        options.port = $scope.port;
        options.userName = $scope.userName;
        options.password = $scope.password;
        var promise = staticService.connectToMysql(options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(errorPayload) { alert("Unable to connect to the database!"); }
        );
    };

    self.createADatabase = function() {
        var options = {};
        options.databaseName = $scope.databaseName;
        var promise = staticService.createADatabase(options);
        promise.then(
            function(payload) {
                self.connectToMysql();
                alert("Successfully created a new database!");
            },
            function(errorPayload) { alert("Unable to connect to the database!");}
        );
    }

    self.createMapping = function(){
        toggleLink("mappingLink");
        $("#config").hide();
        $("#mapper").show();
        staticService.readExcelFile(self.excelFile).then(function(data) {
            if(typeof require !== 'undefined') XLS = require('xlsjs');
            var workbook = XLS.read(data, {type: 'binary'});
            var modelText = "";
            self.excelSheets = workbook.SheetNames;
            self.excelSheets.forEach(function(y) {
                self.excelAsJson.push(staticService.toJson(workbook));
            });

            for(var i=0; i<self.excelSheets.length; i++) {
                var sheet = self.excelSheets[i];
                if(self.tables.length > 0) {
                    var hasMatchingTable = false;
                    for (var j = 0; i < self.tables.length; i++) {
                        var table = self.tables[j];
                        if (sheet == table) {
                            hasMatchingTable = true;
                            var map = {};
                            map.from = sheet;
                            map.to = table;
                            var columns = staticService.getColumnsInExcelSheet(sheet, self.excelAsJson);

                            self.objectMapper.push(map);
                        }
                    }
                    if(!hasMatchingTable) {
                        var map = {};
                        map.from = sheet;
                        map.to = null;
                        var columns = staticService.getColumnsInExcelSheet(sheet, self.excelAsJson);
                        console.log(columns);

                        self.objectMapper.push(map);
                    }
                }
            }
        });
    }

    self.updateObjectMapper = function(sheet, table) {
        var map = {};

        objectMapper
        console.log(option);
    }
}

export default excelToMysqlCtrl;