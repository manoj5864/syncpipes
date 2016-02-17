let  objectMapperFactory = function (staticService, $rootScope) {
    "use strict";
    var objectMapper = [];
    return {
        getData: function() {
            return objectMapper;
        },
        createObjectMapper: function(jsonData){
            //var nodes = staticService.getNodes(jsonData);
            //for (var iNode=0; iNode<nodes.length; iNode++){
            //    var map={};
            //    map.from = nodes[iNode];
            //    map.to = null;
            //    var attributes = staticService.getAttributesOfNode(jsonData, nodes[iNode]);
            //    map.attributes=[];
            //    for (var iAttribute=0; iAttribute < attributes.length; iAttribute++){
            //        var temp = {};
            //        temp.from = attributes[iAttribute];
            //        temp.to = null;
            //        map.attributes.push(temp);
            //    }
            //    objectMapper.push(map);
            //}
            objectMapper = staticService.getFakeMapperObject();
            $rootScope.$broadcast('mapperBroadcast');
        },
        getAttributes: function(node,attribute){
            for(var i=0; i<objectMapper.length; i++) {
                if(objectMapper[i].from === node) {
                    return objectMapper[i].attributes
                }
            }
        },

        getTable: function(node){
            for(var i=0; i<objectMapper.length; i++) {
                if(objectMapper[i].from === node) {
                    return objectMapper[i].to;
                }
            }
        },

        updateNodes: function(node, table){
            for(var i=0; i<objectMapper.length; i++) {
                if(objectMapper[i].from === node) {
                    objectMapper[i].to = table;
                    for(var j=0; j<objectMapper[i].attributes.length; j++)
                        objectMapper[i].attributes[j].to = null;
                    // add more logic to update the map automatically here..
                }
            }
            $rootScope.$broadcast('mapperBroadcast');
        },
        updateAttributes: function(node, attribute, field){

            for(var i=0; i<objectMapper.length; i++) {
                if(objectMapper[i].from === node) {
                    for(var j=0; j<objectMapper[i].attributes.length; j++) {
                        if(objectMapper[i].attributes[j].from === attribute)
                            objectMapper[i].attributes[j].to = field;
                    }
                    // add more logic to update the map automatically here..
                }
            }
            $rootScope.$broadcast('mapperBroadcast');
        },
        isEmpty: function() {
            return objectMapper.length == 0;
        },
        clear: function() {
            objectMapper = [];
            $rootScope.$broadcast('mapperBroadcast');
        }
    };

};
objectMapperFactory.$inject = [
    'StaticService',
    '$rootScope'
];
export default objectMapperFactory;
