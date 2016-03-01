import template from "components/excelToSC/views/excelScMapper.html!text"

let excelScMapper = function($rootScope, excelSCDataFactory, excelService) {
    "use strict";

    var controller = function($scope, excelSCDataFactory, excelService) {
        $scope.init = function() {
            $scope.types = excelSCDataFactory.getTypes();
            $scope.excelSheets = excelSCDataFactory.getExcelSheets();
            initializeObjectMapper();
            $scope.objectMapper = excelSCDataFactory.getObjectMapper();
        };

        $scope.$on('objectMapperUpdated', function() {
            $scope.objectMapper = excelSCDataFactory.getObjectMapper();
        });

        var initializeObjectMapper = function() {
            var excelSheets = excelSCDataFactory.getExcelSheets();
            var types = excelSCDataFactory.getTypes();

            for(var i=0; i<excelSheets.length; i++) {
                var sheet = excelSheets[i];
                var hasMatchingType = false;

                for(var j=0; j<types.length; j++) {
                    var type = types[j];
                    if (sheet.toUpperCase() === type.name.toUpperCase()) {
                        hasMatchingType = true;
                        var map = {};
                        map.from = sheet;
                        map.to = type.name;
                        var columnsOfExcel = excelService.getColumnsInExcelSheet(sheet, excelSCDataFactory.getExcelJson());
                        var columnsOfType = type.attributeDefinitions;

                        map.attributes = [];
                        for (var coe in columnsOfExcel) {
                            var aMap = {};
                            var value = columnsOfExcel[coe];
                            aMap.from = value;
                            if(columnsOfType != null) {
                                for (var k=0; k<columnsOfType.length; k++) {
                                    if (columnsOfType[k].name.toUpperCase() === value.toUpperCase()) {
                                        aMap.to = columnsOfType[k].name;
                                        break;
                                    }
                                }
                            }
                            map.attributes.push(aMap);
                        }
                        excelSCDataFactory.updateObjectMapper(map);
                    }
                }

                if(!hasMatchingType) {
                    var map = {};
                    map.from = sheet; map.to = sheet;
                    var columns = excelService.getColumnsInExcelSheet(sheet, excelSCDataFactory.getExcelJson());

                    map.attributes = [];
                    for(var j=0; j<columns.length; j++) {
                        var aMap = {};
                        aMap.from = columns[j]; aMap.to = columns[j];
                        map.attributes.push(aMap);
                    }

                    excelSCDataFactory.updateObjectMapper(map);
                }
            }
        };
    };

    var linker = function (scope, element, attrs) {
        scope.getAttributeDefinitions = function(typeName) {
            for(var i=0; i<scope.types.length; i++) {
                if (scope.types[i].name === typeName.name) {
                    return scope.types[i].attributeDefinitions;
                }
            }
        };

        scope.executeModel = function() {
            excelSCDataFactory.setExcelSCActiveTab("execution");
        };
    };

    return {
        restrict: 'E',
        link: linker,
        scope: {},
        controller: controller,
        template: template
    };
};

excelScMapper.$inject = ['$rootScope', 'excelSCDataFactory', 'excelService'];
export default excelScMapper;