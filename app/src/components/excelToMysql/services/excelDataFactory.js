
let  excelDataFactory = function ($rootScope) {
    "use strict";
    var excelJson = null;
    var excelSheets = [];
    return {
        getData: function() {
            return excelJson;
        },
        setData: function(data) {
            excelJson = data;
            $rootScope.$broadcast('sourceBroadcast');
        },
        setExcelSheets: function(es) {
            excelSheets = es;
        },
        getExcelSheets: function() {
          return excelSheets;
        },
        isEmpty: function() {
            for(var prop in excelJson) {
                if(excelJson.hasOwnProperty(prop))
                    return false;
            }
            return true;
        },
        clear: function() {
            excelJson = null;
            $rootScope.$broadcast('sourceBroadcast');
        }
    };
};
excelDataFactory.$inject = ['$rootScope'];
export default excelDataFactory;
