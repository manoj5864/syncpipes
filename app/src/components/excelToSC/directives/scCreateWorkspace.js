import template from "components/excelToSC/views/scCreateWorkspace.html!text";

let scCreateWorkspace = function(excelSCDataFactory, scAuth, scData) {
    "use strict";

    var linker = function (scope, element, attrs) {
        scope.createWorkspace = function() {

            scAuth.login(excelSCDataFactory.getAuth().user, excelSCDataFactory.getAuth().password).then(function (response) {

                scData.Workspace.save({name: scope.workspaceNameToCreate}, function(response) {
                    excelSCDataFactory.setWorkspace(response);
                    scope.workspaceName = response.name;
                    scope.message = "New workspace successfully created!";
                }, function(error) {
                    scope.message = "Could not create a new workspace. Please try again!";
                });

            });
        };
    };

    return {
        restrict: 'E',
        link: linker,
        template: template
    };
};

scCreateWorkspace.$inject = ['excelSCDataFactory', 'scAuth', 'scData'];
export default scCreateWorkspace;