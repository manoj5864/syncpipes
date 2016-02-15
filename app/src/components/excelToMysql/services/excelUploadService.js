import "js-xlsx"
import "js-xlsx/dist/cpexcel"

let excelUploadService = function($q, excelService, excelDataFactory) {
    "use strict";
    var service = this;
    var deferred = $q.defer();
    service.upload = function (file) {
        if(file.name.split('.').pop() !== 'xlsx') {
            deferred.reject({"message": "Illegal file format"});
        } else {
            excelService.readExcelFile(file).then(function (data) {
                if (typeof require !== 'undefined') XLS = require('xlsjs');
                var workbook = XLS.read(data, {type: 'binary'});
                var excelSheets = workbook.SheetNames;
                excelDataFactory.setExcelSheets(excelSheets);
                var excelAsJson = [];
                excelSheets.forEach(function (y) {
                    excelAsJson.push(excelService.toJson(workbook));
                });
                excelDataFactory.setData(excelAsJson);
                deferred.resolve();
            }, function (msg) {
                deferred.reject(msg);
            });
        }
        return deferred.promise;
    };
};

excelUploadService.$inject = [ '$q', 'mysqlService', 'excelDataFactory' ];

export default excelUploadService;
