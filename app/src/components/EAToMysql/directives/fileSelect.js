import template from "components/EAToMysql/views/fileUpload.html!text"


export default function fileSelect(uploadService, jsonDataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        var url = attrs['urlPost'];
        element.bind('change', function (event) {
            var files = event.target.files;
            var promise = uploadService.upload(files[0], url);
            scope.status = 'loading';
            scope.message = "The file is loading";
            promise.then(
                function(payload) {
                    scope.status = 'success';
                    element.find("input").each(function(i, input){input.value = ""});
                    scope.message = "File successfully uploaded"
                },
                function(errorPayload) {
                    scope.status = 'fail';
                    scope.message = errorPayload.data != null ? errorPayload.data.message : "Oops... Upload failed. Check if connection to the server established";
                }
            );
        });
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            status: "=",
            message: "="
        },
        template: template
    };
};

fileSelect.$inject = ['uploadService', 'jsonDataFactory'];
export default fileSelect;
