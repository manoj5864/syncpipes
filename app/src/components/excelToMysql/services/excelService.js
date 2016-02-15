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
    };

    return service;
};