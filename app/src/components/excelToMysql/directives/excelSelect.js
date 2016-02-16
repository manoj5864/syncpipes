import template from "components/excelToMysql/views/excelUpload.html!text";

let excelSelect = function(excelService, dataFactories){
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.status = 'empty';
        scope.message = "Upload an excel file";

        bindListener();
        scope.$on('sourceBroadcast', function() {
            if (!dataFactories.getDataFactory(scope.dataFactoryName).isExcelDataEmpty()) {
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
            dataFactories.getDataFactory(scope.dataFactoryName).clearExcelJson();
        };

        function bindListener(){
            element.bind('change', function (event) {
                var files = event.target.files;
                var promise = excelService.upload(files[0], dataFactories.getDataFactory(scope.dataFactoryName));
                scope.status = 'loading';
                scope.message = "The file is being processed";
                promise.then(
                    function (payload) {
                        scope.status = 'success';
                        element.find("input").each(function (i, input) {
                            input.value = ""
                        });
                        scope.message = "Excel file was successfully extracted!";
                    },
                    function (errorPayload) {
                        scope.status = 'fail';
                        scope.message = errorPayload != null ? errorPayload.message : "Oops... Upload failed. Check if the excel file is valid!";
                    }
                );
            });
        };
    };
    return {
        restrict: 'E',
        link: linker,
        scope: {
            dataFactoryName: "="
        },
        template: template
    };
};

excelSelect.$inject = ['excelService', 'dataFactories'];
export default excelSelect;
