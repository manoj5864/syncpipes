import template from "components/EAToMysql/views/attrMapper.html!text"


export default function attrMapper(staticService, jsonDataFactory, objectMapperFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        let node = attrs['node'];
        let table = attrs['table'];

        scope.nodeAttrs = staticService.getAttributesOfNode(jsonDataFactory.getData(), scope.node);

        scope.$watch(table,function(){
            if (scope.table != undefined){
                objectMapperFactory.updateNodes(scope.node,scope.table);
                staticService.getColumns(scope.table).then(
                    function (payload) {
                        return scope.fields=payload;
                    },
                    function (error) {
                        return scope.error=error;
                    }
                );
            }
        });
        scope.update = function(node, attribute, column){
            objectMapperFactory.updateAttributes(node, attribute, column.Field);
        }
    };
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        link: linker,
        scope: {
            nodeAttrs: '=',
            node:'=',
            table: '=',
            fields: '=',
            error: "=",
            ngModel: '=',
            update: "="
        },
        template: template
    };
};
