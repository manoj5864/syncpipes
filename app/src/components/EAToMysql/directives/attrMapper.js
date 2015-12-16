import template from "components/EAToMysql/views/attrMapper.html!text"


export default function attrMapper(staticService, jsonDataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        let node = attrs['node'];
        let table = attrs['table'];


        staticService.getColumns().then(
            function (payload) {
                console.log(payload);
                return scope.tables=payload;
            },
            function (error) {
                return scope.error=error;
            }
        );
        scope.nodeAttrs = staticService.getNodeAttributes(jsonDataFactory.getData());
    };
    return {
        require: ['^mapper'],
        restrict: 'E',
        link: linker,

        scope: {
            node:'=',
            table: '=',
            error: "=",
            ngModel: '='
        },
        template: template
    };
};
