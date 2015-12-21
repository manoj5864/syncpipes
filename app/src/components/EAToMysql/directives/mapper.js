import template from "components/EAToMysql/views/mapper.html!text"

export default function mapper(staticService, jsonDataFactory, objectMapperFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.hidden = jsonDataFactory.isEmpty();
        if (!jsonDataFactory.isEmpty){
            objectMapperFactory.createObjectMapper(jsonDataFactory.getData())
        }
        staticService.getTables().then(
            function (payload) {

                return scope.tables=payload;
            },
            function (error) {
                return scope.error=error;
            }
        );
        scope.nodes = staticService.getNodes(jsonDataFactory.getData());
        objectMapperFactory.createObjectMapper(jsonDataFactory.getData());

    };
    return {
        restrict: 'E',
        //transclude: 'true',
        link: linker,
        scope: {
            hidden:'=',
            nodes: '=',
            tables: '=',
            error: "=",
            ngModel: '='
        },
        template: template
    };
};

