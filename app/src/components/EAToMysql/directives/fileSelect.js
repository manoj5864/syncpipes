import template from "components/EAToMysql/views/fileUpload.html!text"


export default function fileSelect(uploadService, jsonDataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Upload your .eap file";
        bindListener();
        scope.$on('sourceBroadcast', function() {
            if (!jsonDataFactory.isEmpty()) {
                scope.status = 'success';
                scope.message = "Data already loaded";
            }
            else {
                scope.status = 'empty';
                scope.message = "Upload your .eap file";
            }
            bindListener();
        });
        scope.reset = function(){
            jsonDataFactory.clear();
        };
        function bindListener(){
            element.bind('change', function (event) {
                var files = event.target.files;
                var promise = uploadService.upload(files[0]);
                scope.status = 'loading';
                scope.message = "The file is processed";
                promise.then(
                    function (payload) {
                        scope.status = 'success';
                        element.find("input").each(function (i, input) {
                            input.value = ""
                        });
                        scope.message = "Data were successfully extracted."
                    },
                    function (errorPayload) {
                        scope.status = 'fail';
                        scope.message = errorPayload.data != null ? errorPayload.data.message : "Oops... Upload failed. Check if connection to the server established";
                    }
                );
            });
        }
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            status: "=",
            message: "=",
            reset: "="
        },
        template: template
    };
};

fileSelect.$inject = ['uploadService', 'jsonDataFactory'];
export default fileSelect;
