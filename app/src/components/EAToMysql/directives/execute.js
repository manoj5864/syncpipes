import template from "components/EAToMysql/views/execute.html!text"

export default function execute(staticService, jsonDataFactory, objectMapperFactory){
    "use strict";
    function getMapFromObjectMapper(objectMapper, fromObject) {
        for(var i=0; i<objectMapper.length; i++)
            if(objectMapper[i].from === fromObject) return objectMapper[i];
    }

    var linker = function (scope, element, attrs) {
        scope.db_record_success_logs = {};
        scope.db_record_error_logs = {};
        scope.errorFlagExecution = false;

        scope.execute = function(){
            var nodes = staticService.getNodes(jsonDataFactory.getData());
            for(var i=0; i<nodes.length; i++) {
                var map = getMapFromObjectMapper(objectMapperFactory.getData(), nodes[i]);
                if (map.to != null || map.to != undefined){
                    var temp = {};
                    for(var iAttribute=0; iAttribute<map.attributes.length; iAttribute++) {
                        if (map.attributes[iAttribute].to != null || map.attributes[iAttribute].to != undefined){
                            temp[map.attributes[iAttribute].to] = staticService.getAttributesValues(jsonDataFactory.getData(), nodes[i],map.attributes[iAttribute].from);
                        }
                    }
                    transformAndSaveToMysql(map.to, temp);
                }
            }
            scope.infoMessage = "Data transfer has been started ...";
        };

        function transformAndSaveToMysql(table, attributeValuesObj) {
            var keys = [];
            keys = Object.keys(attributeValuesObj);
            for (var i=0; i<attributeValuesObj[keys[0]].length; i++){
                var temp= {};
                for (var j=0; j<keys.length;j++){
                    temp[keys[j]] = attributeValuesObj[keys[j]][i];
                }
                staticService.insertRow(table, temp).then(function(payload) {
                    scope.db_record_success_logs[table] != undefined ? scope.db_record_success_logs[table] = scope.db_record_success_logs[table] + 1 : scope.db_record_success_logs[table] = 1;
                    scope.infoMessage = "Data transfer has been completed";
                }, function(errorPayload) {
                    scope.errorFlagExecuting = true;
                    scope.db_record_error_logs[table] != undefined ? scope.db_record_error_logs[table] = scope.db_record_error_logs[table] + 1 : scope.db_record_error_logs[table] = 1;
                });

            }

        }
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            infoMessage:'=',
            execute:'=',
            db_record_success_logs:'=',
            db_record_error_logs: '=',
            errorFlagExecution: '='
        },
        template: template
    };
};

