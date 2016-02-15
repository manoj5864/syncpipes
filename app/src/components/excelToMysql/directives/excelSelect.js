import template from "components/excelToMysql/views/excelUpload.html!text";

let excelSelect = function(excelService, dataFactory){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Upload an excel file";
        bindListener();
        scope.$on('sourceBroadcast', function() {
            if (!dataFactory.isExcelDataEmpty()) {
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
            dataFactory.clearExcelJson();
        };

        function bindListener(){
            element.bind('change', function (event) {
                var files = event.target.files;
                var promise = excelService.upload(files[0]);
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

excelSelect.$inject = ['excelService', 'dataFactory'];
export default excelSelect;
