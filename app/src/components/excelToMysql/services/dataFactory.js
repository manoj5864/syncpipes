let  dataFactory = function ($rootScope) {
    "use strict";
    var data = {};

    data.activeTab = "config";
    data.database = null;
    data.tableColumnMap = {};
    data.tables = null;
    data.objectMapper = [];

    return {
        getData: function() {
            return data;
        },
        setData: function(d) {
            data = d;
            $rootScope.$broadcast('dataBroadcast');
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
        clear: function() {
            data = null;
            $rootScope.$broadcast('dataBroadcast');
        }
    };

};
dataFactory.$inject = ['$rootScope'];
export default dataFactory;
