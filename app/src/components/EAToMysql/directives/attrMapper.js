import template from "components/EAToMysql/views/attrMapper.html!text"


export default function attrMapper(staticService, jsonDataFactory, objectMapperFactory){
    "use strict";

    var linker = function (scope, element, attrs) {

        //let node = attrs['node'];
        //let table = attrs['table'];
        let node = scope.node;
        let table = scope.table;
        let attributeFrom = attrs['attribute'];
        let attributeTo = attrs['field'];

        staticService.getColumns(table).then(
            function (payload) {
                return scope.fields=payload;
            },
            function (error) {
                return scope.error=error;
            }
        );
        scope.update = function(node, attribute, column){
            objectMapperFactory.updateAttributes(node, attribute, field);
        }
    };
    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        link: linker,
        scope: {
            node:'=',
            table: '=',
            field: '=',
            attribute: "="
        },
        template: template
    };
};
