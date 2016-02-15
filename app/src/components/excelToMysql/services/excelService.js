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
                var excelAsJson = service.toJson(workbook);
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
        var keys = Object.keys(excelAsJson);
        for(var i=0; i<keys.length; i++)
            if(keys[i] === sheet)
                return Object.keys(excelAsJson[keys[i]][0]);
        return [];
    };

    service.getObjectMapper = function(dataFactory) {
        var excelSheets = dataFactory.getExcelSheets();
        var tables = dataFactory.getTables();
        console.log(dataFactory.getObjectMapper());
        for(var i=0; i<excelSheets.length; i++) {
            var sheet = excelSheets[i];
            var hasMatchingTable = false;

            for(var j=0; j<tables.length; j++) {
                var table = tables[j];
                if (sheet.toUpperCase() === table.toUpperCase()) {
                    hasMatchingTable = true;
                    var map = {};
                    map.from = sheet;
                    map.to = table;
                    var columnsOfExcel = service.getColumnsInExcelSheet(sheet, dataFactory.getExcelJson());
                    var columnsOfTable = dataFactory.getColumnsOfTable(table);

                    map.attributes = [];
                    for (var coe in columnsOfExcel) {
                        var aMap = {};
                        var value = columnsOfExcel[coe];
                        aMap.from = value;
                        if(columnsOfTable != null) {
                            for (var k=0; k<columnsOfTable.length; k++) {
                                var cot = columnsOfTable[k];
                                if (cot.Field.toUpperCase() === value.toUpperCase()) {
                                    aMap.to = cot.Field;
                                    break;
                                }
                            }
                        }
                        map.attributes.push(aMap);
                    }

                    if(!hasObject(table, sheet)) {
                        dataFactory.pushToObjectMapper(map);
                    }
                }
            }

            if(!hasMatchingTable) {
                var map = {};
                map.from = sheet; map.to = sheet;
                var columns = service.getColumnsInExcelSheet(sheet, dataFactory.getExcelJson());

                map.attributes = [];
                for(var j=0; j<columns.length; j++) {
                    var aMap = {};
                    aMap.from = columns[j]; aMap.to = columns[j];
                    map.attributes.push(aMap);
                }

                if(!hasObject(sheet,sheet)) {
                    dataFactory.pushToObjectMapper(map);
                }
            }
        }
    };

    var hasObject = function(to, from) {
        for(var i=0; i< dataFactory.getObjectMapper().length; i++) {
            var obj = dataFactory.getObjectMapper()[i];
            if(obj.from.toUpperCase() === from.toUpperCase() && obj.to.toUpperCase() === to.toUpperCase()) {
                return true;
            } else {
                return false;
            }
        }
    }
};


excelService.$inject = ['$q', 'dataFactory'];

export default excelService;
