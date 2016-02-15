
let  excelDataFactory = function ($rootScope) {
    "use strict";
    var JSONSchema = null;
    return {
        getData: function() {
            return JSONSchema;
        },
        setData: function(data) {
            JSONSchema = data;
            $rootScope.$broadcast('sourceBroadcast');
        },
        isEmpty: function() {
            for(var prop in JSONSchema) {
                if(JSONSchema.hasOwnProperty(prop))
                    return false;
            }
            return true;
        },
        clear: function() {
            JSONSchema = null;
            $rootScope.$broadcast('sourceBroadcast');
        }
    };

};
excelDataFactory.$inject = ['$rootScope'];
export default excelDataFactory;
