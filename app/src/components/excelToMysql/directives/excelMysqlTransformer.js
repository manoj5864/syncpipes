import template from "components/excelToMysql/views/excelMysqlTransformer.html!text"

let excelMysqlTransformer = function(mysqlService, dataFactory){
    "use strict";

    var controller = function($scope, mysqlService, dataFactory) {
        $scope.init = function() {

            var objectMapper = dataFactory.getObjectMapper();
            var tableColumnMap = dataFactory.getTableColumnMap();

            for(var i=0; i<objectMapper.length; i++) {
                var map = objectMapper[i];

                //create table
                if(!tableColumnMap.hasOwnProperty(map.to)) {
                    var cols = [];
                    for(var j=0; j<map.attributes.length; j++)
                        cols.push(map.attributes[j].to);

                    createTable(dataFactory.getDatabase(), map.to, cols);
                } else {
                    //logic to update table and columns if table exist goes here
                }
            }

            sleep(1000);

            //insert row
            var excelAsJson = dataFactory.getExcelJson();
            var keys = Object.keys(excelAsJson);
            for(var i=0; i<keys.length; i++) {
                var key = keys[i];
                var sheetAsJson = excelAsJson[key];

                var map = getMapFromObjectMapper(objectMapper, key);
                var tableName = map.to;

                for(var j=0; j<sheetAsJson.length; j++) {
                    var attributes = {};
                    var rowAsJson = sheetAsJson[j];
                    for(var k=0; k<map.attributes.length; k++) {
                        var aMap = map.attributes[k];
                        attributes[aMap.to] = rowAsJson[aMap.from];
                    }
                    insertRow(dataFactory.getDatabase(), tableName, attributes);
                }
            }

            sleep(1000);
            $(".log").append("<br /><h3>Execution complete!</h3>");

        }
    };

    var createTable = function(databaseName, tableName, cols) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.cols = cols;
        var promise = mysqlService.queryMysql(fixedUrl.createTable, options);
        promise.then(function(payload) {
            $(".log").append(">> Created table " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to create table " + tableName);});
    };

    var getMapFromObjectMapper = function(objectMapper, fromObject) {
        for(var i=0; i<objectMapper.length; i++)
            if(objectMapper[i].from === fromObject) return objectMapper[i];
    };

    var insertRow = function(databaseName, tableName, attributes) {
        var options = {};
        options.databaseName = databaseName;
        options.tableName = tableName;
        options.attributes = attributes;
        var promise = mysqlService.queryMysql(fixedUrl.insertRow, options);
        promise.then(function(payload) {
            $(".log").append(">> New row added to " + tableName + "<br />");
        }, function(errorPayload) { alert("Unable to insert row in table " + tableName + "---" + errorPayload);});
    };

    return {
        restrict: 'E',
        scope: {
            status: "=",
            message: "="
        },
        controller: controller,
        template: template
    };
};

excelMysqlTransformer.$inject = ['mysqlService', 'dataFactory'];
export default excelMysqlTransformer;
