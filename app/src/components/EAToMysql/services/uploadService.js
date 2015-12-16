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

        //$http.post(url, fd, {
        //    headers: { 'Content-Type': undefined },
        //    transformRequest: angular.identity
        //}).success(function (data) {
        //    $http.get(url+"?fileName="+data, {})
        //        .success(function (data) {
        //            jsonDataFactory.setData(JSON.parse(data));
        //            service.status.success = true;
        //        })
        //        .error(function (error) {
        //            jsonDataFactory.clear();
        //            service.status.success = false;
        //            service.status.msg = error;
        //        });
        //})
        //.error(function (error) {
        //    jsonDataFactory.clear();
        //    service.status.success = false;
        //    service.status.msg = error;
        //})
        //.catch(function(error){
        //    jsonDataFactory.clear();
        //    service.status.success = false;
        //    service.status.msg = error;
        //});

uploadService.$inject = [
    '$http',
    '$q',
    'jsonDataFactory'
];

export default uploadService;
