let  excelSCDataFactory = function ($rootScope) {
    "use strict";
    var data = {};
    data.auth = {user: "manoj5864@gmail.com", password: "@Sociocortex"};
    data.name = "excelToSC";
    data.types = null;
    data.workspaces = null;
    data.excelJson = null;
    data.excelSheets = [];
    data.objectMapper = [];
    data.tableColumnMap = {};
    data.activeTab = "config";
    data.workspace = null;
    data.workspaceName = null;

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
        setExcelSCActiveTab: function(tab) {
            data.activeTab = tab;
            $rootScope.$broadcast('excelSCTabBroadcast');
        },
        getExcelSCActiveTab: function(){
            return data.activeTab;
        },
        setWorkspace: function(workspace) {
          data.workspace = workspace;
          $rootScope.$broadcast('workspaceUpdateBroadcast');
        },
        getWorkspace: function() {
          return data.workspace;
        },
        setWorkspaceName: function(workspaceName) {
            data.workspaceName = workspaceName;
        },
        getWorkspaceName: function() {
            return data.workspaceName;
        },
        setWorkspaces: function(ws) {
            data.workspaces = ws;
        },
        getWorkspaceByName: function(name) {
            for(var i=0; i< data.workspaces.length; i++) {
                if(data.workspaces[i].name === name) {
                    this.setWorkspace(data.workspaces[i]);
                    return data.workspaces[i];
                }
            }
            return null;
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
        },
        initializeObjectMapper: function() {
            for(var i=0; i<data.excelSheets.length; i++) {
                var from = data.excelSheets[i];
                var map = {};
                map.from = from;
                var attributes = [];
                var cols = Object.keys(data.excelJson[from][0]);
                for(var j=0; j<cols.length; j++) {
                    var attrMap = {};
                    attrMap.from = cols[j];
                    attributes.push(attrMap);
                }
                map.attributes = attributes;
                data.objectMapper.push(map);
            }
        },
        updateObjectMapper: function(map) {
            for(var i=0; i<data.objectMapper.length; i++)
                if(data.objectMapper[i].from.toUpperCase() === map.from.toUpperCase())
                    data.objectMapper[i] = map;
        }
    };
};
excelSCDataFactory.$inject = ['$rootScope'];
export default excelSCDataFactory;
