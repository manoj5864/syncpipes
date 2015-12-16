import template from "components/EAToMysql/views/mapper.html!text"


export default function mapper(staticService, jsonDataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.hidden = jsonDataFactory.isEmpty();
        staticService.getTables().then(
            function (payload) {
                console.log(payload);
                return scope.tables=payload;
            },
            function (error) {
                return scope.error=error;
            }
        );
        scope.nodes = staticService.getNodes(jsonDataFactory.getData());
    };
    return {
        
        restrict: 'E',
        transclude: 'true',
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

