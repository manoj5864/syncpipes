import template from "components/excelToSC/views/scSelectWorkspace.html!text";

let scSelectWorkspace = function($scope, dataFactory, scCrud) {
    "use strict";

    var controller = function($scope) {
        $scope.message = "";
        $scope.workspace = "";
        $scope.init = function() {
            scCrud.workspaces.findAll(dataFactory.getAuth()).then(function(response) {
                $scope.workspaces = response;
            }, function() {
                $scope.message = "Something went wrong. Unable to retrieve workspaces!";
            });
        };
    };

    var linker = function (scope, element, attrs) {
        scope.$watch('workspace', function() {
            if(!isEmpty(scope.workspace)) {
                dataFactory.setWorkspace(scope.workspace);
                scCrud.types.findAll(dataFactory.getAuth(), scope.workspace.id, null).then(function(response) {
                    dataFactory.setTypes(response);
                    scope.types = response;
                }, function() {
                    $scope.message = "Unable to retrieve types in workspace " + scope.workspace.name;
                });
            }
        });
    };

    return {
        restrict: 'E',
        link: linker,
        scope: {
            dataFactoryName: "="
        },
        controller: controller,
        template: template
    };
};

scSelectWorkspace.$inject = ['$rootScope', 'dataFactory', 'scCrud'];
export default scSelectWorkspace;