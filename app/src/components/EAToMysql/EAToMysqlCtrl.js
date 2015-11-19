import angular from 'angular';
import "js-xlsx"
import "js-xlsx/dist/cpexcel"

function EAToMysqlCtrl($scope, staticService) {
    "use strict";
    var self = this;
    self.databases = null;

    self.init = function() {
        toggleLink("configLink");
    };

    self.excelFile = null;
    $scope.selectExcelFile = function() {
        var fileInput = document.getElementById('excelFile');
        var file = fileInput.files[0];
        self.excelFile = file;
    };

    self.readExcelFile = function() {
        var reader = new FileReader();
        var name = self.excelFile.name;
        reader.onload = function(e) {
            var data = e.target.result;
            if(typeof require !== 'undefined') XLS = require('xlsjs');
            var workbook = XLS.read(data, {type: 'binary'});

            var modelText = "";
            var sheet_name_list = workbook.SheetNames;
            sheet_name_list.forEach(function(y) {
                var worksheet = workbook.Sheets[y];
                var wjso = staticService.to_json(workbook);
                console.log(wjso);
            });
        };
        reader.readAsBinaryString(self.excelFile);
    };

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
            function(payload) { self.databases = payload;},
            function(errorPayload) { alert("Unable to connect to the database!");}
        );
    }
}

export default EAToMysqlCtrl;