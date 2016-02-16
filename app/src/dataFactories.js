let  dataFactories = function (dataFactory, excelSCDataFactory) {
    "use strict";

    return {
        getDataFactory: function(param) {
            if(param === "excelToMysql") {
                return dataFactory;
            } else {
                return excelSCDataFactory;
            }
        }
    };

};
dataFactories.$inject = ['dataFactory', 'excelSCDataFactory'];
export default dataFactories;