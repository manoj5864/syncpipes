import angular from 'angular';
import traverse from 'traverse';

function EAToMysqlCtrl($scope, $http, staticService) {
    "use strict";
    var self = this;
    var uploadUrl = "http://localhost:51248/api/repository/";
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

    self.init = function() {
        toggleLink("configLink");
    };


    self.getNodes = function () {
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

    self.getAttributesOfNode = function(node){
            var data = staticService.dataFromEA();
            var obj = JSON.parse(data);
            let keys = new Set();
            
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

    self.getAttributesValues = function(node, attribute){
        var data = staticService.dataFromEA();
        var obj = JSON.parse(data);
        var listOfValues = [];
        for (var i=0;i<obj[node].length;i++){
            var value = traverse(obj[node]).get([i,attribute]);
            listOfValues.push(value);
        }
        return listOfValues;
    };

    $scope.selectEAFile = function() {
        var fileInput = document.getElementById('EAFile');
        self.EAFile = fileInput.files[0];
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
                    var promise = staticService.queryMysql(getTables, options);
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
        var promise = staticService.queryMysql(mysqlConnectionServer, options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(errorPayload) { alert("Unable to connect to the database!"); }
        );
    };

    self.createADatabase = function() {
        var options = {};
        options.databaseName = $scope.databaseName;
        var promise = staticService.queryMysql(mysqlCreateDB, options);
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
            var promise = staticService.queryMysql(getColumns, options);
            promise.then(function(payload) {
                self.tableColumnMap[tableName] = payload; //Field, Type, Null, Key, Default, Extra
                return payload;
            }, function(errorPayload) { alert("Unable to get columns!");});
        }
    }

    self.createMapping = function(){
        toggleLink("mappingLink");
        $("#config").hide();
        $("#mapper").show();

        for(var i=0; i<self.tables.length; i++)
            self.getColumns($scope.database, self.tables[i]);

        var nodes = self.getNodes();
        for (var iNode=0; iNode<nodes.length; iNode++){
            var map={};
            map.from = nodes[iNode];
            map.to = null;
            var attributes = self.getAttributesOfNode(nodes[iNode])
            map.attributes=[];
            for (var iAttribute=0; iAttribute < attributes.length; iAttribute++){
                var temp = {};
                temp.from = attributes[iAttribute];
                temp.to = null;
                map.attributes.push(temp);
            }
            self.objectMapper.push(map);
        }
        
        self.nodes = self.getNodes();
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
    }

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
    }


    self.executeModel = function() {
        toggleLink("executionLink");
        $("#mapper").hide();
        $("#execution").show();

        var nodes = self.getNodes();
        console.log(self.objectMapper);
        for(var i=0; i<nodes.length; i++) {

            var map = self.getMapFromObjectMapper(self.objectMapper, nodes[i]);

            if (map.to != null){
                var attributeValuesList = []
                for(var iAttribute=0; iAttribute<map.attributes.length; iAttribute++) {
                    if (map.attributes[iAttribute].to != null){
                        var temp = [];
                        temp.push({
                            key: map.attributes[iAttribute].to ,
                            value:self.getAttributesValues(nodes[i],map.attributes[iAttribute].from)
                        });
                        attributeValuesList.push(temp);
                    }
                }
                console.log(attributeValuesList);
            }


            //self.insertRow($scope.database, tableName, attributeValuesList);

        }

        sleep(1000);
        $(".log").append("<br /><h3>Execution complete!</h3>");
    }

    self.getMapFromObjectMapper = function(objectMapper, fromObject) {
        for(var i=0; i<self.objectMapper.length; i++)
            if(self.objectMapper[i].from === fromObject) return self.objectMapper[i];
    }


    self.createTable = function(databaseName, tableName, cols) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.cols = cols;
        var promise = staticService.queryMysql(createTable, options);
        promise.then(function(payload) {
            $(".log").append(">> Created table " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to create table " + tableName);});
    }

    self.insertRow = function(databaseName, tableName, attributes) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.attributes = attributes;
        var promise = staticService.queryMysql(insertRow, options);
        promise.then(function(payload) {
            $(".log").append(">> New row added to " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to insert row in table " + tableName + "---" + errorPayload);});
    }



}

export default EAToMysqlCtrl;