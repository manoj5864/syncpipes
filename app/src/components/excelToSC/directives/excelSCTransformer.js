import template from "components/excelToSC/views/excelScTransformer.html!text"

let excelScTransformer = function($rootScope, scAuth, scModel, scData, excelSCDataFactory){
    "use strict";

    var controller = function($scope, excelSCDataFactory) {
        $scope.init = function() {
            var objectMapper = excelSCDataFactory.getObjectMapper();
            var types = excelSCDataFactory.getTypes();
            var workspace = excelSCDataFactory.getWorkspaceByName(excelSCDataFactory.getWorkspaceName());

            scAuth.login(excelSCDataFactory.getAuth().user, excelSCDataFactory.getAuth().password).then(function (response) {
                //create types
                if(types.length == 0) {
                    for (var i = 0; i < objectMapper.length; i++) {
                        var map = objectMapper[i];
                        var data = { name: map.to, namePlural: map.to, workspace: { id: workspace.id } };
                        scModel.EntityType.save(data).$promise.then(function success(entityType) {
                            $(".log").append("<br />.. New Type Created: " + entityType.name);
                            var attributes = getAttributes(entityType.name, excelSCDataFactory);
                            for(var j=0; j<attributes.length; j++) {
                                scModel.AttributeDefinition.save({name: attributes[j].to, entityType: entityType});
                            }
                            sleep(1000);
                            createEntityForType(entityType.name, entityType.id, excelSCDataFactory);
                        });
                    }
                }

            });
            $(".log").append("<br /><h3>In Progress!</h3>");
        }
    };

    var createEntityForType = function(typeName, typeId, excelSCDataFactory) {
        //insert row
        var excelAsJson = excelSCDataFactory.getExcelJson();
        var keys = Object.keys(excelAsJson);
        for(var i=0; i<keys.length; i++) {
            var key = keys[i];
            if (key === typeName) {
                var sheetAsJson = excelAsJson[key];
                var map = getMapFromObjectMapper(excelSCDataFactory.getObjectMapper(), key);
                for (var j = 0; j < sheetAsJson.length; j++) {
                    var attributes = {};
                    var rowAsJson = sheetAsJson[j];

                    for (var k = 0; k < map.attributes.length; k++) {
                        var aMap = map.attributes[k];
                        attributes[aMap.to] = rowAsJson[aMap.from];
                    }
                    createEntity(typeId, rowAsJson[map.attributes[0].from], attributes);
                }
            }
        }
    }

    var createEntity = function(typeId, entityName, attr) {

        var entity = scData.Entity.arrayifyAttributes({
            name: entityName,
            attributes: attr,
            entityType: { id: typeId }
        });

        scData.Entity.save(entity, function (entity) {
            $(".log").append("<br />.. New Entity Created: " + entity.name);
        });
    }

    var getMapFromObjectMapper = function(objectMapper, fromObject) {
        for(var i=0; i<objectMapper.length; i++)
            if(objectMapper[i].from === fromObject) return objectMapper[i];
    };

    var getAttributes = function(entityName, excelSCDataFactory) {
        var objectMapper = excelSCDataFactory.getObjectMapper();
        for (var i = 0; i < objectMapper.length; i++) {
            var map = objectMapper[i];
            if(map.to === entityName) {
                return map.attributes;
            }
        }
        return [];
    }

    return {
        restrict: 'E',
        controller: controller,
        template: template
    };
};

excelScTransformer.$inject = ['$rootScope', 'scAuth', 'scModel', 'scData', 'excelSCDataFactory'];
export default excelScTransformer;
