import template from "components/EAToMysql/views/mapper.html!text"

export default function mapper(staticService, jsonDataFactory, objectMapperFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.$on('sourceBroadcast', function() {
            scope.hidden = jsonDataFactory.isEmpty();
            scope.tableMap = {};
            if (!jsonDataFactory.isEmpty()) {
                objectMapperFactory.createObjectMapper(jsonDataFactory.getData())
            }
            staticService.getTables().then(
                function (payload) {
                    for (var i=0;i<payload.length;i++){
                        let tableName = payload[i];
                        staticService.getColumns(tableName).then(
                            function (payload) {
                                console.log(payload);
                                var cols = [];
                                for(var j=0; j<payload.length; j++) {
                                    cols.push(payload[j].Field);

                                }
                                scope.tableMap[tableName]=cols;
                            });
                    }
                    console.log(scope.tableMap);
                    return scope.tables = payload;
                },
                function (error) {
                    return scope.error = error;
                }
            );

            scope.nodes = staticService.getNodes(jsonDataFactory.getData());
            objectMapperFactory.createObjectMapper(jsonDataFactory.getData());
            scope.objectMapper = objectMapperFactory.getData();

            scope.reset = function () {
                objectMapperFactory.clear();
                objectMapperFactory.createObjectMapper(jsonDataFactory.getData());
                //TODO:clear select values
                //console.log(scope.tableMappingForm.);
            };
        });
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            hidden:'=',
            nodes: '=',
            tables: '=',
            error: "=",
            objectMapper: "="
        },
        template: template
    };
};

