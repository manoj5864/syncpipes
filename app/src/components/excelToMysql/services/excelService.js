var excelService = function($q) {
    var service = {};

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

    service.getObjectMapper = function(excelDataFactory, dataFactory) {
        var excelSheets = excelDataFactory.getExcelSheets();
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
                    var columnsOfExcel = service.getColumnsInExcelSheet(sheet, excelDataFactory.getData());
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
                var columns = service.getColumnsInExcelSheet(sheet, excelDataFactory.getData());
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

    function getColumnsOfTable(table, map) {
        for(table in map) {
            if(map.hasOwnProperty(table)) {
                return map[table];
            }
        }
        return null;
    }

    return service;
};