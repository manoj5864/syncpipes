import template from "components/EAToMysql/views/mapper.html!text"

export default function mapper(staticService, jsonDataFactory, objectMapperFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.$on('sourceBroadcast', function() {
            scope.hidden = jsonDataFactory.isEmpty();

            if (!jsonDataFactory.isEmpty) {
                objectMapperFactory.createObjectMapper(jsonDataFactory.getData())
            }
            staticService.getTables().then(
                function (payload) {
                    return scope.tables = payload;
                },
                function (error) {
                    return scope.error = error;
                }
            );
            scope.nodes = staticService.getNodes(jsonDataFactory.getData());
            objectMapperFactory.createObjectMapper(jsonDataFactory.getData());

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
            error: "="
        },
        template: template
    };
};

