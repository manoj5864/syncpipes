import angular from 'angular';
import "components/jiraToMysql/js/jiraObjectMapper";

function jiraToMysqlCtrl($q, $scope, $location, jiraToMysqlService) {
    "use strict";
    var self = this;
    self.databases = null;
    self.tables = [];
    self.columns = [];
    self.objectMapper = jiraObjectMapper;
    $scope.jiraProject = "";
    $scope.database = null;
    $scope.newTableName = null;
    self.tableColumnMap = {};

    self.jiraOptions = {};
    self.jiraProjects = [];

    self.jiraUrls = {
        project: "/rest/api/2/project",
        priority: "/rest/api/2/priority",
        status: "/rest/api/2/status",
        issuetype: "/rest/api/2/issuetype",
        issue: "/rest/api/2/search?jql=project="
    };

    self.jiraTables = ["project", "issue", "status", "priority", "issuetype"];

    $scope.$watch('database', function() {
        if (self.databases != null) {
            for (var i = 0; i < self.databases.length; i++) {
                var db = self.databases[i];
                if (db.Database === $scope.database) {
                    var options = {};
                    options.databaseName = $scope.database;
                    var promise = jiraToMysqlService.queryMysql(fixedUrl.getTables, options);
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
        var promise = jiraToMysqlService.queryMysql(fixedUrl.mysqlConnectionServer, options);
        promise.then(
            function(payload) { self.databases = payload; },
            function(errorPayload) { alert("Unable to connect to the database!"); }
        );
    };

    self.createDatabase = function() {
        var options = {};
        options.databaseName = $scope.databaseName;
        var promise = jiraToMysqlService.queryMysql(fixedUrl.mysqlCreateDB, options);
        promise.then(function(payload) {
            self.connectToMysql();
            alert("Successfully created a new database!");
        }, function(errorPayload) { alert("Unable to connect to the database!");});
    };

    self.createTable = function(databaseName, tableName, cols) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.cols = cols;
        var promise = jiraToMysqlService.queryMysql(fixedUrl.createTable, options);
        promise.then(function(payload) {
            $(".log").append(">> Created table " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to create table " + tableName);});
    };

    self.createEmptyTable = function() {
        var options = {};
        options.databaseName = $scope.database;
        options.tableName = $scope.newTableName;
        var promise = jiraToMysqlService.queryMysql(fixedUrl.createEmptyTable, options);
        promise.then(function(payload) {
            var options = {};
            options.databaseName = $scope.database;
            var promise = jiraToMysqlService.queryMysql(fixedUrl.getTables, options);
            promise.then(
                function(payload) { self.tables = payload; },
                function(errorPayload) { alert("Unable to get tables!");}
            );
        }, function(errorPayload) { alert("Unable to create table " + tableName);});
    };

    self.insertRow = function(databaseName, tableName, attributes) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.attributes = attributes;
        var promise = jiraToMysqlService.queryMysql(fixedUrl.insertRow, options);
        promise.then(function(payload) {
            $(".log").append(">> New row added to " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to insert row in table " + tableName + "---" + errorPayload);});
    };

    var jiraOptions = {};

    self.getJiraProjects = function() {
        /*self.jiraOptions.jiraUrl = $scope.jiraUrl;
        self.jiraOptions.userName = $scope.jiraUserName;
        self.jiraOptions.jiraPassword = $scope.jiraPassword;*/

        self.jiraOptions.jiraUrl = "http://localhost:8085";
        self.jiraOptions.userName = "manoj5864";
        self.jiraOptions.jiraPassword = "@Jira5864";

        jiraOptions.method = "GET";
        jiraOptions.baseUrl = self.jiraOptions.jiraUrl;
        jiraOptions.path = self.jiraUrls.project;
        jiraOptions.userName = self.jiraOptions.userName;
        jiraOptions.password = self.jiraOptions.jiraPassword;

        var promise = jiraToMysqlService.requestHttp(jiraOptions);
        promise.then(function(payload) { self.jiraProjects = payload; },
            function(errorPayload) { alert("Unable to connect to JIRA");});
    };

    function getJiraPath(jt) {
        var keys = Object.keys(self.jiraUrls);
        for(var i=0; i<keys.length; i++) {
            if(keys[i] === jt) {
                return self.jiraUrls[jt];
            }
        }
    }

    self.createMapping = function() {
        toggleLink("mappingLink");
        $("#config").hide();
        $("#mapper").show();

        for(var i=0; i<self.objectMapper.length; i++) {
            var jt = self.objectMapper[i].from;
            var hasMatchingTable = false;
            for(var j=0; j<self.tables.length; j++) {
                var table = self.tables[j];
                if (jt === table) {
                    hasMatchingTable = true;
                    var map = {};
                    self.objectMapper[i].to = table;
                    var attributesOfJT = self.objectMapper[i].attributes;
                    self.getColumns($scope.database, table);
                }
            }

            if(!hasMatchingTable) {
                for(var i=0; i<self.objectMapper.length; i++) {
                    self.objectMapper[i].to = self.objectMapper[i].from;
                    for (var j = 0; j < self.objectMapper[i].attributes.length; j++)
                        self.objectMapper[i].attributes[j].to = self.objectMapper[i].attributes[j].from;
                }
            }
        }
    };

    self.getColumns = function(databaseName, tableName) {
        if (tableName !== undefined && databaseName !== undefined) {
            var options = {};
            options.databaseName = databaseName;
            options.tableName = tableName;
            var promise = jiraToMysqlService.queryMysql(fixedUrl.getColumns, options);
            promise.then(function(payload) {
                for(var i=0; i<self.objectMapper.length; i++) {
                    for(var k=0; k<self.objectMapper[i].attributes.length; k++) {
                        for(var j=0; j<payload.length; j++) {
                            if (self.objectMapper[i].attributes[k].from === payload[j].Field) {
                                self.objectMapper[i].attributes[k].to = payload[j].Field;
                                break;
                            }
                        }
                    }
                }
                //Field, Type, Null, Key, Default, Extra
                var attributes = [];
                for(var j=0; j<payload.length; j++)
                    attributes.push(payload[j].Field);
                self.tableColumnMap[tableName] = attributes;
            }, function(errorPayload) { alert("Unable to get columns!");});
        }
    };

    self.updateObjectMapper = function (jiraTable, table) {
        for(var i=0; i<self.objectMapper.length; i++) {
            if(self.objectMapper[i].from === jiraTable) {
                self.objectMapper[i].to = table;
                for(var j=0; j<self.objectMapper[i].attributes.length; j++)
                    self.objectMapper[i].attributes[j].to = "";
                // add more logic to update the map automatically here..
            }
        }
    }

    self.executeModel = function() {
        toggleLink("executionLink");
        $("#mapper").hide();
        $("#execution").show();
        for(var i=0; i<self.objectMapper.length; i++) {
            var map = self.objectMapper[i];

            //create table
            if(!self.tableColumnMap.hasOwnProperty(map.to)) {
                var cols = [];
                for(var j=0; j<map.attributes.length; j++)
                    cols.push(map.attributes[j].to);
                self.createTable($scope.database, map.to, cols);
            } else {
                //logic to update table and columns if table exist goes here
            }
        }

        sleep(1000); // create a function to "createTables" that returns a promise, add the subsequent code that creates rows in resolve.
        //insert row
        for(var i=0; i<self.objectMapper.length; i++) {
            var map = self.objectMapper[i];
            var jiraPath = getJiraPath(map.from);
            if(map.from === "issue") jiraPath += $scope.jiraProject + "&expand=names";
            createRowfromJiraPath(map, jiraPath);
        }
        $(".log").append("<br /><h3>Execution complete!</h3>");
    }

    function createRowfromJiraPath(map, jiraPath) {
        jiraOptions.path = jiraPath;
        var promise = jiraToMysqlService.requestHttp(jiraOptions);
        promise.then(function(payload) {
            var names = {};
            if(map.from === "issue") {
                names = payload.names;
                payload = payload.issues;
            }
            for(var j=0; j<payload.length; j++) {
                var res = payload[j];
                var attributes = {};
                for (var k=0; k<map.attributes.length; k++)
                    attributes[map.attributes[k].to] = getAttributeValue(res, map.attributes[k], names);
                self.insertRow($scope.database, map.to, attributes);
            }
        }, function(errorPayload) { alert("Unable to connect to JIRA");});
    }

    function getAttributeValue(res, aMap, namesMap) {
        if(res.hasOwnProperty(aMap.from)) {
            if(aMap.fromType === "object") return res[aMap.from][aMap.fromId];
            else if(aMap.fromType === "arrayOfObjects") {
                var ids = [];
                for(var i=0; i<res[aMap.from].length; i++)
                    ids.push(res[aMap.from][i][aMap.fromId])
                return ids;
            } else return res[aMap.from];
        } else if(res.hasOwnProperty("fields") && res.fields.hasOwnProperty(aMap.from)){
            return getAttributeValue(res.fields, aMap, namesMap);
        } else if(aMap.customfield) {
            var cv = getKeyForValue(namesMap, aMap.from);
            if(cv != null) return res.fields[cv];
        }
    }

    function getKeyForValue(json, value) {
        for(var key in json) {
            if(key.indexOf("customfield") > -1) {
                if (typeof (json[key]) === "object")
                    return getKeyForValue(json[key], value);
                else if (json[key] === value)
                    return key;
            }
        }
        return null;
    }
}

export default jiraToMysqlCtrl;