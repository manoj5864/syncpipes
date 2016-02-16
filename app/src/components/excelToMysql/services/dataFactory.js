let  dataFactory = function ($rootScope) {
    "use strict";
    var data = {};

    data.name = "excelToMysql";
    data.tables = null;
    data.database = null;
    data.excelJson = null;
    data.excelSheets = [];
    data.objectMapper = excelObjectMapper;
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
        getName: function() {
          return data.name;
        },
        getExcelJson: function() {
            return data.excelJson;
        },
        setExcelJson: function(d) {
            data.excelJson = d;
            $rootScope.$broadcast('sourceBroadcast');
        },
        setExcelSheets: function(es) {
            data.excelSheets = es;
        },
        getExcelSheets: function() {
            return data.excelSheets;
        },
        setObjectMapper: function(d) {
          data.objectMapper = d;
            $rootScope.$broadcast('objectMapperUpdated');
        },
        pushToObjectMapper: function(d) {
            data.objectMapper.push(d);
            $rootScope.$broadcast('objectMapperUpdated');
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
            $rootScope.$broadcast('tableColumnMapUpdated');
        },
        getTableColumnMap: function() {
          return data.tableColumnMap;
        },
        getColumnsOfTable: function(table) {
            return data.tableColumnMap[table];
        },
        isEmpty: function() {
            for(var prop in data)
                if(data.hasOwnProperty(prop))
                    return false;
            return true;
        },
        isExcelDataEmpty: function() {
            if(data.excelJson == null) return true;
            else return false;
        },
        clearExcelJson: function() {
            data.excelJson = null;
            $rootScope.$broadcast('sourceBroadcast');
        },
        clear: function() {
            data = null;
            $rootScope.$broadcast('dataBroadcast');
        }
    };

};
dataFactory.$inject = ['$rootScope'];
export default dataFactory;
