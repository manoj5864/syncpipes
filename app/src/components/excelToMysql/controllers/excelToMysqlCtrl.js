import angular from 'angular';
import "js-xlsx"
import "js-xlsx/dist/cpexcel"

function excelToMysqlCtrl($q, $scope, excelService, dataFactory) {
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

    $scope.$on('tabBroadcast', function() {
        $scope.activeTab = dataFactory.getActiveTab();
    });

    $scope.selectExcelFile = function() {
        var fileInput = document.getElementById('excelFile');
        var file = fileInput.files[0];
        self.excelFile = file;
    };

    self.getExcelRowAsJson = function(sheetName) {
        for(var i=0; i<self.excelSheets.length; i++)
            if(self.excelSheets[i].hasOwnProperty(sheetName))
                return self.excelSheets[i][sheetName];
        return null;
    }
}

export default excelToMysqlCtrl;