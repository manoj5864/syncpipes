var mysqlService = function($http, $q) {
    var service = {};
    var POST = "POST";

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
    };

    return service;
};