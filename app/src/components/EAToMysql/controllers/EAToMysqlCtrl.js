import traverse from 'traverse';

let EAToMysqlCtrl = function ($scope, $http, staticService, jsonDataFactory) {
    "use strict";
    var self = this;
    self.uploadUrl = "http://localhost:9000/api/repository/";
    self.EAFile = null;
    self.databases = null;
    self.tableColumnMap = {};
    self.objectMapper = [];
    var mysqlConnectionServer = "http://localhost:8084/connectToMysql";
    var mysqlCreateDB = "http://localhost:8084/createADatabase";
    var getTables = "http://localhost:8084/getTables";
    var getColumns = "http://localhost:8084/getColumns";
    var createTable = "http://localhost:8084/createTable";
    var insertRow = "http://localhost:8084/insertRow";

    $scope.showFileUpload = true;
    $scope.showData = false;

    //Test data
    //self.JSONSchema = JSON.parse(staticService.dataFromEA());


    self.init = function() {
        toggleLink("configLink");
    };

    $scope.selectEAFile = function() {
        self.fileInput = document.getElementById('EAFile');
        self.EAFile = fileInput.files[0];
    };


    self.getEAJson = function(data) {

        $scope.errorFlagEA = false;
        $http.get(uploadUrl+"?fileName="+data, {})
            .success(function (data) {
                self.JSONSchema = JSON.parse(data);
                $scope.showFileUpload = false;
                $scope.showData = true;
                $("#db-connect").show();

            })
            .error(function (error) {
                $scope.errors = error;
                $scope.errorFlagEA = true;
            });
    };

    self.repeatUpload = function(){
        $scope.showFileUpload = true;
        $scope.showData = false;
    };

    //self.getNodes = function (obj) {
    //
    //    var nodes = [];
    //
    //    traverse(obj).forEach(function () {
    //        if (this.level == 1) {
    //            nodes.push(this.key);
    //        }
    //    });
    //    return nodes;
    //};

    //
    //TODO: Clean up after creating directives
    self.getAttributesOfNode = function (obj, node) {

        let keys = new Set();

        traverse(obj[node]).forEach(function () {
            if (this.level == 2) {
                keys.add(this.key);
            }
        });
        var keysList = [];
        keys.forEach(function (key, value) {
            keysList.push(value);
        });
        return keysList;
    };

    //self.getAttributesValues = function (obj, node, attribute) {
    //    var listOfValues = [];
    //    for (var i = 0; i < obj[node].length; i++) {
    //        var value = traverse(obj[node]).get([i, attribute]);
    //        listOfValues.push(value);
    //    }
    //    return listOfValues;
    //};


    $scope.$watch('database', function() {
        if (self.databases != null) {
            for (var i = 0; i < self.databases.length; i++) {
                var db = self.databases[i];
                if (db.Database === $scope.database) {
                    var options = {};
                    options.databaseName = $scope.database;
                    var promise = staticService.queryMysql(getTables, options);
                    promise.then(
                        function(payload) { self.tables = payload; },
                        function(error) {
                            $scope.errors = "Something went wrong... Could not see DB tables!";
                            $scope.errorFlagMysql = true;
                        }
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
        var promise = staticService.queryMysql(mysqlConnectionServer, options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(error) {
                $scope.errors = "No connection to the mysql server were established. Check if the server is running and try again!"
                $scope.errorFlagMysql = true;
            }
        );
    };

    self.getColumns = function(databaseName, tableName) {
        if (tableName !== undefined && databaseName !== undefined) {
            var options = {};
            options.databaseName = databaseName;
            options.tableName = tableName;
            var promise = staticService.queryMysql(getColumns, options);
            promise.then(function(payload) {
                self.tableColumnMap[tableName] = payload; //Field, Type, Null, Key, Default, Extra
                return payload;
            }, function(errorPayload) { alert("Unable to get columns!");});
        }
    };


    self.createMapping = function(){
        toggleLink("mappingLink");
        $("#mapper").show();

        for(var i=0; i<self.tables.length; i++)
            self.getColumns($scope.database, self.tables[i]);

        var nodes = staticService.getNodes(jsonDataFactory.getData());
        for (var iNode=0; iNode<nodes.length; iNode++){
            var map={};
            map.from = nodes[iNode];
            map.to = null;
            var attributes = staticService.getAttributesOfNode(jsonDataFactory.getData(), nodes[iNode]);
            map.attributes=[];
            for (var iAttribute=0; iAttribute < attributes.length; iAttribute++){
                var temp = {};
                temp.from = attributes[iAttribute];
                temp.to = null;
                map.attributes.push(temp);
            }
            self.objectMapper.push(map);
        }

        self.nodes = staticService.getNodes(jsonDataFactory.getData());
    };

    self.updateObjectMapper = function(node, table) {
        for(var i=0; i<self.objectMapper.length; i++) {
            if(self.objectMapper[i].from === node) {
                self.objectMapper[i].to = table;
                for(var j=0; j<self.objectMapper[i].attributes.length; j++)
                    self.objectMapper[i].attributes[j].to = null;
                // add more logic to update the map automatically here..
            }
        }
    };

    self.updateAttributeMapper = function(node, attribute, tableColumn) {
        for(var i=0; i<self.objectMapper.length; i++) {
            if(self.objectMapper[i].from === node) {
                for(var j=0; j<self.objectMapper[i].attributes.length; j++) {
                    if(self.objectMapper[i].attributes[j].from === attribute)
                        self.objectMapper[i].attributes[j].to = tableColumn;
                }
                // add more logic to update the map automatically here..
            }
        }
    };

    self.transformAndSaveToMysql = function(table, attributeValuesObj) {
        var keys = [];
        keys = Object.keys(attributeValuesObj);
        for (var i=0; i<attributeValuesObj[keys[0]].length; i++){
            var temp= {};
            for (var j=0; j<keys.length;j++){
                temp[keys[j]] = attributeValuesObj[keys[j]][i];
            }
            self.insertRow($scope.database, table, temp);
        }
        self.infoMessage = "Data transfer has been completed";
    };

    self.executeModel = function() {
        toggleLink("executionLink");
        $("#mapper").hide();
        $("#execution").show();

        var nodes = staticService.getNodes(self.JSONSchema);

        for(var i=0; i<nodes.length; i++) {

            var map = self.getMapFromObjectMapper(self.objectMapper, nodes[i]);
            if (map.to != null){
                var temp = {};
                for(var iAttribute=0; iAttribute<map.attributes.length; iAttribute++) {
                    if (map.attributes[iAttribute].to != null){
                        temp[map.attributes[iAttribute].to] = staticService.getAttributesValues(self.JSONSchema, nodes[i],map.attributes[iAttribute].from);
                    }
                }
                self.transformAndSaveToMysql(map.to, temp);
            }
        }
        self.infoMessage = "Data transfer has been started ...";

    }

    self.getMapFromObjectMapper = function(objectMapper, fromObject) {
        for(var i=0; i<self.objectMapper.length; i++)
            if(self.objectMapper[i].from === fromObject) return self.objectMapper[i];
    }

    self.db_record_success_logs = {};
    self.db_record_error_logs = {};
    $scope.errorFlagExecution = false;

    self.insertRow = function(databaseName, tableName, attributes) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.attributes = attributes;
        var promise = staticService.queryMysql(insertRow, options);
        
        promise.then(function(payload) {
            self.db_record_success_logs[tableName] != undefined ? self.db_record_success_logs[tableName] = self.db_record_success_logs[tableName] + 1 : self.db_record_success_logs[tableName] = 1;
        }, function(errorPayload) {
            $scope.errorFlagExecuting = true;
            self.db_record_error_logs[tableName] != undefined ? self.db_record_error_logs[tableName] = self.db_record_error_logs[tableName] + 1 : self.db_record_error_logs[tableName] = 1;
        });
    }
}

export default [
    '$scope',
    '$http',
    'staticService',
    'jsonDataFactory',
    EAToMysqlCtrl
];
