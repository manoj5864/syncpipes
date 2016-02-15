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
            for(var i=0; i<excelAsJson.length; i++) {
                var sheetAsJson = excelAsJson[i];
                var sheet = Object.keys(sheetAsJson)[0];
                var map = getMapFromObjectMapper(objectMapper, sheet);

                var tableName = map.to;
                var rowsAsJson = sheetAsJson[sheet];

                for(var j=0; j<rowsAsJson.length; j++) {
                    var attributes = {};
                    var rowAsJson = rowsAsJson[j];
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
