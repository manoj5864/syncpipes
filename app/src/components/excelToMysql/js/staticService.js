var staticService = function($http, $q) {
    var service = {};
    var POST = "POST";

    service.readExcelFile = function(file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        var name = self.excelFile.name;
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
            if(Object.keys(jo)[0] === sheet) {
                for(var j=0; j< jo[sheet].length; j++){
                    return Object.keys(jo[sheet][j]);
                }
            }
        }
    }

    service.queryMysql = function(url, options) {
        var deferred = $q.defer();
        $http({
            url: url,
            method: POST,
            async: false,
            data: options,
            dataType: "json",
            contentType: "application/json",
        }).then(function(res) {
            deferred.resolve(res.data);
        }, function(msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    }

    return service;
};