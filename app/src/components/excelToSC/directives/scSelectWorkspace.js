import template from "components/excelToSC/views/scSelectWorkspace.html!text";

let scSelectWorkspace = function(excelSCDataFactory, scAuth, scModel, scData) {
    "use strict";

    var controller = function($scope) {
        $scope.message = "";

        $scope.$on('workspaceUpdateBroadcast', function() {
            getWorkspaces();
            $scope.workspaceName = excelSCDataFactory.getWorkspace().name;
        });

        $scope.init = function() {
            getWorkspaces();
        };

        function getWorkspaces() {
            scAuth.login(excelSCDataFactory.getAuth().user, excelSCDataFactory.getAuth().password).then(function (response) {
                scData.Workspace.query(function(response) {
                    $scope.workspaces = response;
                    excelSCDataFactory.setWorkspaces(response);
                }, function() {
                    $scope.message = "Something went wrong. Unable to retrieve workspaces!";
                });
            });
        };
    };

    var linker = function (scope, element, attrs) {
        scope.$watch('workspaceName', function() {
            if(!isEmpty(scope.workspaceName)) {
                excelSCDataFactory.setWorkspaceName(scope.workspaceName.name);
                scAuth.login(excelSCDataFactory.getAuth().user, excelSCDataFactory.getAuth().password).then(function (response) {
                    scModel.EntityType.queryByWorkspace({ id: scope.workspaceName.id }, function (types) {
                        excelSCDataFactory.setTypes(types);
                        scope.types = types;
                    });
                });
            }
        });

        scope.createExcelSCMapping = function() {
            excelSCDataFactory.setExcelSCActiveTab("mapper");
        };
    };

    return {
        restrict: 'E',
        link: linker,
        controller: controller,
        template: template
    };
};

scSelectWorkspace.$inject = ['dataFactory', 'scAuth', 'scModel', 'scData'];
export default scSelectWorkspace;