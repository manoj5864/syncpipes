var jiraToMysqlService = function($http, $q) {
    var service = {};

    service.queryMysql = function(url, options) {
        var deferred = $q.defer();
        $http({
            url: url,
            method: "POST",
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

    service.requestHttp = function(options) {
        var deferred = $q.defer();
        $http({
            url: getFullUrl(options.baseUrl, options.path),
            method: options.method,
            async: false,
            data: options.data,
            dataType: "json",
            contentType: "application/json",
            headers: getHeaders(options.userName, options.password)
        }).then(function(res) {
            deferred.resolve(res.data);
        }, function(msg) {
            deferred.reject(msg);
        });
        return deferred.promise;
    };

    service.getAttributesInJT = function(jt, map) {
        for(var i=0; i<map.length; i++)
            if(map[i].from === jt)
                return map[i].attributes;
    };

    function getHeaders(user, password) {
        return { Authorization: 'Basic ' + window.btoa(user + ':' + password) };
    }

    function combinePaths(str1, str2) {
        if (str1.charAt(str1.length - 1) === '/') str1 = str1.substr(0, str1.length - 1);
        if (str2.charAt(0) === '/') str2 = str2.substr(1, str2.length - 1);
        return str1 + '/' + str2;
    }

    function getFullUrl(baseUrl, path) {
        return combinePaths(baseUrl, path);
    }

    return service;
};