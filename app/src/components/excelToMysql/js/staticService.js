var staticService = function($http, $q) {
    var service = {};

    var mysqlConnectionServer = "http://localhost:8084/connectToMysql";
    var mysqlCreateDB = "http://localhost:8084/createADatabase";

    var POST = "POST";

    service.to_json = function(workbook) {
        var result = {};
        workbook.SheetNames.forEach(function(sheetName) {
            var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if(roa.length > 0){
                result[sheetName] = roa;
            }
        });
        return result;
    };

    service.connectToMysql = function(options) {
        var deferred = $q.defer();
        $http({
            url: mysqlConnectionServer,
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
    };

    service.createADatabase = function(options) {
        var deferred = $q.defer();
        $http({
            url: mysqlCreateDB,
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