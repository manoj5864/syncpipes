let  dataFactory = function ($rootScope) {
    "use strict";
    var data = {};

    data.tables = null;
    data.database = null;
    data.excelJson = null;
    data.excelSheets = [];
    data.objectMapper = [];
    data.tableColumnMap = {};
    data.activeTab = "config";

    return {
        getData: function() {
            return data;
        },
        setData: function(d) {
            data = d;
            $rootScope.$broadcast('dataBroadcast');
        },
        getExcelJson: function() {
            return data.excelJson;
        },
        setExcelJson: function(d) {
            data.excelJson = d;
        },
        setExcelSheets: function(es) {
            data.excelSheets = es;
        },
        getExcelSheets: function() {
            return data.excelSheets;
        },
        setObjectMapper: function(d) {
          data.objectMapper = d;
        },
        pushToObjectMapper: function(d) {
            data.objectMapper.push(d);
        },
        getObjectMapper: function () {
            return data.objectMapper;
        },
        setActiveTab: function(tab) {
            data.activeTab = tab;
            $rootScope.$broadcast('tabBroadcast');
        },
        getActiveTab: function(){
            return data.activeTab;
        },
        setDatabase: function(database) {
          data.database = database;
        },
        getDatabase: function() {
          return data.database;
        },
        setTables: function(t) {
            data.tables = t;
        },
        getTables: function() {
            return data.tables;
        },
        updateTableColumnMap: function(key, value) {
          data.tableColumnMap[key] = value;
        },
        getTableColumnMap: function() {
          return data.tableColumnMap;
        },
        isEmpty: function() {
            for(var prop in data)
                if(data.hasOwnProperty(prop))
                    return false;
            return true;
        },
        isExcelDataEmpty: function() {
            for(var prop in data.excelJson)
                if(data.excelJson.hasOwnProperty(prop))
                    return false;
            return true;
        },
        clearExcelJson: function() {
          data.excelJson = [];
        },
        clear: function() {
            data = null;
            $rootScope.$broadcast('dataBroadcast');
        }
    };

};
dataFactory.$inject = ['$rootScope'];
export default dataFactory;
