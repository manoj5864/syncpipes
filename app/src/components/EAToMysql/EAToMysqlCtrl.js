import angular from 'angular';
import traverse from 'traverse';

function EAToMysqlCtrl($scope, $http, staticService) {
    "use strict";
    var self = this;
    var uploadUrl = "http://localhost:51248/api/repository/";
    self.EAFile = null;
    self.databases = null;

    $scope.showFileUpload = true;
    $scope.showData = false;

    self.init = function() {
        toggleLink("configLink");
    };


    $scope.getNodes = function () {
        var data = staticService.dataFromEA();
        var obj = JSON.parse(data);
        var nodes = [];
        traverse(obj).forEach(function(){
            if (this.level == 1){
                nodes.push(this.key);
            }
        });
        return nodes;
    };

    $scope.getAttributesOfNode = function(node){
            var data = staticService.dataFromEA();
            var obj = JSON.parse(data);
            let keys = new Set();
            console.log(node);
            traverse(obj[node]).forEach(function(){
                if (this.level == 2){
                    keys.add(this.key);
                }
            });
            var keysList = [];
            keys.forEach(function(key, value){
                keysList.push(value);
            });
            return keysList;
    };

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
            }).success(function (data) {
                self.getEAJson(data);
                $scope.showFileUpload = false;
            })
            .error(function (error) {console.log(error)});

    };


    self.getEAJson = function(data) {
        //todo:add file handling
        $http.get(uploadUrl+"?fileName="+data, {})
            .success(function (data) {
                var obj = JSON.parse(data);
                //var leaves = traverse(obj).paths();
                //console.dir(leaves);

                $scope.JSONSchema = data;
                $scope.showData = true;
            })
            .error(function (error) {
                console.log(error)
            });
    };

    $scope.$watch('database', function() {
        if (self.databases != null) {
            for (var i = 0; i < self.databases.length; i++) {
                var db = self.databases[i];
                if (db.Database === $scope.database) {
                    var options = {};
                    options.databaseName = $scope.database;
                    var promise = excelToMysqlService.queryMysql(getTables, options);
                    promise.then(
                        function(payload) { self.tables = payload; },
                        function(errorPayload) { alert("Unable to get tables!");}
                    );
                }
            }
        }
    });

    self.connectToMysql = function() {
        var options = {};
        options.baseUrl = $scope.baseUrl;
        options.port = $scope.port;
        options.userName = $scope.userName;
        options.password = $scope.password;
        var promise = excelToMysqlService.queryMysql(mysqlConnectionServer, options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(errorPayload) { alert("Unable to connect to the database!"); }
        );
    };

    self.createADatabase = function() {
        var options = {};
        options.databaseName = $scope.databaseName;
        var promise = excelToMysqlService.queryMysql(mysqlCreateDB, options);
        promise.then(function(payload) {
            self.connectToMysql();
            alert("Successfully created a new database!");
        }, function(errorPayload) { alert("Unable to connect to the database!");});
    }

    self.getColumns = function(databaseName, tableName) {
        if (tableName !== undefined && databaseName !== undefined) {
            var options = {};
            options.databaseName = databaseName;
            options.tableName = tableName;
            var promise = excelToMysqlService.queryMysql(getColumns, options);
            promise.then(function(payload) {
                self.tableColumnMap[tableName] = payload; //Field, Type, Null, Key, Default, Extra
                return payload;
            }, function(errorPayload) { alert("Unable to get columns!");});
        }
    }




}

export default EAToMysqlCtrl;