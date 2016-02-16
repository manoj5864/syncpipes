let  excelSCDataFactory = function ($rootScope) {
    "use strict";
    var data = {};
    data.auth = {user: "manoj5864@gmail.com", password: "@Sociocortex"};
    data.name = "excelToSC";
    data.types = null;
    data.workspaces = null;
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
        getAuth: function() {
            return data.auth;
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
        setWorkspace: function(workspace) {
          data.workspace = workspace;
        },
        getWorkspace: function() {
          return data.workspace;
        },
        setTypes: function(types) {
            data.types = types;
        },
        getTypes: function() {
            return data.types;
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
excelSCDataFactory.$inject = ['$rootScope'];
export default excelSCDataFactory;
