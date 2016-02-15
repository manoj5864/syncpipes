import "js-xlsx"
import "js-xlsx/dist/cpexcel"

let excelService = function($q, dataFactory) {
    "use strict";
    var service = this;
    var excelFile = null;

    service.setExcelFile = function(file) {
        excelFile = file;
    };

    service.getExcelFile = function() {
        return excelFile;
    };

    service.readExcelFile = function(file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function(e) {
            deferred.resolve(e.target.result);
        };
        reader.readAsBinaryString(file);
        return deferred.promise;
    };

    service.upload = function (file) {
        var deferred = $q.defer();
        if(file.name.split('.').pop() !== 'xlsx') {
            deferred.reject({"message": "Illegal file format"});
        } else {
            service.readExcelFile(file).then(function (data) {
                if (typeof require !== 'undefined') XLS = require('xlsjs');
                var workbook = XLS.read(data, {type: 'binary'});
                var excelSheets = workbook.SheetNames;
                dataFactory.setExcelSheets(excelSheets);
                var excelAsJson = [];
                excelSheets.forEach(function (y) {
                    excelAsJson.push(service.toJson(workbook));
                });
                console.log(excelAsJson);
                dataFactory.setExcelJson(excelAsJson);
                deferred.resolve();
            }, function (msg) {
                deferred.reject(msg);
            });
        }
        return deferred.promise;
    };

    service.toJson = function(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if(roa.length > 0) result[sheetName] = roa;
        });
        return result;
    };

    service.getColumnsInExcelSheet = function(sheet, excelAsJson) {
        for(var i=0; i<excelAsJson.length; i++){
            var jo = excelAsJson[i];
            if(Object.keys(jo)[0] === sheet)
                for(var j=0; j< jo[sheet].length; j++)
                    return Object.keys(jo[sheet][j]);
        }
        return [];
    };

    service.getObjectMapper = function() {
        var excelSheets = dataFactory.getExcelSheets();
        var tables = dataFactory.getTables();
        var tableColMap = dataFactory.getTableColumnMap();

        for(var i=0; i<excelSheets.length; i++) {
            var sheet = excelSheets[i];
            var hasMatchingTable = false;

            for(var j=0; i<tables.length; i++) {
                var table = tables[j];
                if (sheet == table) {
                    hasMatchingTable = true;
                    var map = {};
                    map.from = sheet;
                    map.to = table;
                    var columnsOfExcel = service.getColumnsInExcelSheet(sheet, dataFactory.getExcelJson());
                    var columnsOfTable = getColumnsOfTable(table, tableColMap);
                    if(map != null) {
                        map.attributes = [];
                        for (var coe in columnsOfExcel) {
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
                        dataFactory.pushToObjectMapper(map);
                    }
                }
            }

            if(!hasMatchingTable) {
                var map = {};
                map.from = sheet; map.to = sheet;
                var columns = service.getColumnsInExcelSheet(sheet, dataFactory.getExcelJson());

                map.attributes = [];
                for(var i=0; i<columns.length; i++) {
                    var aMap = {};
                    aMap.from = columns[i]; aMap.to = columns[i];
                    map.attributes.push(aMap);
                }
                dataFactory.pushToObjectMapper(map);
            }
        }
    };

    var getColumnsOfTable = function(table, map) {
        for(table in map) {
            if(map.hasOwnProperty(table)) {
                return map[table];
            }
        }
        return null;
    };
};


excelService.$inject = ['$q', 'dataFactory'];

export default excelService;
