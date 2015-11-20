import angular from 'angular';


function EAToMysqlCtrl($scope, $http, staticService) {
    "use strict";
    var self = this;
    self.databases = null;
    var uploadUrl = "http://localhost:51248/api/repository/";
    $scope.showFileUpload = true;

    self.init = function() {
        toggleLink("configLink");
    };

    self.EAFile = null;
    $scope.selectEAFile = function() {
        var fileInput = document.getElementById('EAFile');
        var file = fileInput.files[0];
        self.EAFile = file;
    };

    $scope.uploadFile = function(files) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", files[0]);

        $http.post(uploadUrl, fd, {
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function (data) {self.getEAJson(data);
            $scope.showFileUpload = false;
        }
        ).error(function (data) {console.log(data)});

    };


    self.getEAJson = function(data) {
        //todo:add file handling
        $http.get(uploadUrl+"?fileName="+data, {}).success(function (data) {console.log(data)}).error(function (data) {console.log(data)});
    };

    self.connectToMysql = function() {
        var options = {};
        options.baseUrl = $scope.baseUrl;
        options.port = $scope.port;
        options.userName = $scope.userName;
        options.password = $scope.password;
        var promise = staticService.connectToMysql(options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(errorPayload) { alert("Unable to connect to the database!"); }
        );
    };

    self.createADatabase = function() {
        var options = {};
        options.databaseName = $scope.databaseName;
        var promise = staticService.createADatabase(options);
        promise.then(
            function(payload) { self.databases = payload;},
            function(errorPayload) { alert("Unable to connect to the database!");}
        );
    }
}

export default EAToMysqlCtrl;