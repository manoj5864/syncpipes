let uploadService = function($http, $q, jsonDataFactory) {
    "use strict";

    var service = this;
    var url = "http://localhost:9000/api/repository/";

    service.upload = function (file) {
        var fd = new FormData();
        fd.append("file", file);
        var deferred = $q.defer();
        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(
            function (res) {
                $http({
                    url: url + "?fileName=" + res.data,
                    method: 'GET',
                    async: false,
                    dataType: "json",
                    contentType: "application/json"
                }).then(function (res) {
                    jsonDataFactory.setData(JSON.parse(res.data));
                    deferred.resolve(true);
                }, function (msg) {
                    deferred.reject(msg);
                });
                return deferred.promise;
            },
            function (msg) {
                deferred.reject(msg);
            });
            return deferred.promise;
    }

};

uploadService.$inject = [
    '$http',
    '$q',
    'jsonDataFactory'
];

export default uploadService;
