import template from "components/excelToMysql/views/mysqlConfig.html!text"

let mysqlConfig = function (mysqlService, dataFactory, $rootScope){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Connect to Mysql server";

        scope.connectToMysql = function(){
            var options = {};
            options.baseUrl = scope.baseUrl;
            options.port = scope.port;
            options.userName = scope.userName;
            options.password = scope.password;
            var promise = mysqlService.queryMysql(fixedUrl.mysqlConnectionServer, options);
            promise.then(
                function(payload) {
                    scope.databases = payload;
                    scope.status = 'success';
                    scope.message = "Connected to your Mysql server";
                },
                function(errorPayload) {
                    alert("Unable to connect to the database!");
                    scope.status = 'fail';
                    scope.message = "Unable to connect to your Mysql server";
                }
            );
        };

        scope.createDb = function() {
            var options = {};
            options.databaseName = scope.databaseName;
            var promise = mysqlService.queryMysql(fixedUrl.mysqlCreateDB, options);
            promise.then(function(payload) {
                scope.connectToMysql();
                scope.status = 'success';
                scope.message = "Successfully created a new database!";
            }, function(errorPayload) { alert("Unable to create a new database!");});
        };

        scope.$watch('database', function() {
            if(scope.databases != null) {
                for (var i = 0; i < scope.databases.length; i++) {
                    var db = scope.databases[i];
                    if (db.Database === scope.database) {
                        var options = {};
                        options.databaseName = scope.database;
                        var promise = mysqlService.queryMysql(fixedUrl.getTables, options);
                        promise.then(
                            function(payload) { dataFactory.setTables(payload); },
                            function(errorPayload) { alert("Unable to get tables!"); console.log(errorPayload); }
                        );
                    }
                }
            }
        });

        scope.createMapping =function() {
            dataFactory.setDatabase(scope.database);
            dataFactory.setActiveTab("mapper");
        };
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            status: "=",
            message: "=",
            reset: "=",
            baseUrl: "=",
            port: "=",
            userName: "=",
            password: "=",
            connectToMysql: "=",
            databases: "=",
            database: "=",
            createDb: "=",
            databaseName: "=",
            createMapping: "="
        },
        template: template
    };
};

mysqlConfig.$inject = ['mysqlService', 'dataFactory', '$rootScope'];
export default mysqlConfig;
