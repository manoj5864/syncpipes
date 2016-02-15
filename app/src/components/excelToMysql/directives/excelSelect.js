import template from "components/excelToMysql/views/excelUpload.html!text";

let excelSelect = function(excelUploadService, excelDataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Upload an excel file";
        bindListener();
        scope.$on('sourceBroadcast', function() {
            if (!excelDataFactory.isEmpty()) {
                scope.status = 'success';
                scope.message = "Excel file successfully uploaded";
            }
            else {
                scope.status = 'empty';
                scope.message = "Upload an excel file";
            }
            bindListener();
        });

        scope.reset = function(){
            excelDataFactory.clear();
        };

        function bindListener(){
            element.bind('change', function (event) {
                var files = event.target.files;
                var promise = excelUploadService.upload(files[0]);
                scope.status = 'loading';
                scope.message = "The file is being processed";
                promise.then(
                    function (payload) {
                        scope.status = 'success';
                        element.find("input").each(function (i, input) {
                            input.value = ""
                        });
                        scope.message = "Excel file was successfully extracted!"
                    },
                    function (errorPayload) {
                        scope.status = 'fail';
                        scope.message = errorPayload != null ? errorPayload.message : "Oops... Upload failed. Check if the excel file is valid!";
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

excelSelect.$inject = ['excelUploadService', 'excelDataFactory'];
export default excelSelect;
