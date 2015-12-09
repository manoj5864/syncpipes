let fileSelect = function(UploadService){
    "use strict";
    var linker = function (scope, element, attrs) {
        console.log(element);
        console.log(attrs);
        element.bind('change', function (event) {
            console.log("test");
            var files = event.target.files;
            UploadService.upload({'name':attrs['name'],'file':files[0]});
            element.val(null);  // clear input
        });
    };
    return {
        restrict: 'A',
        link: linker
    };
};

export default fileSelect;