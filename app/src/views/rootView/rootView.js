import angular from 'angular';
import ngRoute from 'angular-route';
import rootViewTemplate from 'views/rootView/rootView.html!text';
const ROOT_PATH = '/selectAdapter';

function rootViewCtrl($scope, $location) {
    "use strict";
    var self = this;

    self.adapters = [
        {from: "excel", to: "mysql", label:"exceltomysql", route: "/excelToMysql" },
        {from: "jira", to: "mysql", label: "jiratomysql", route: "/jiraToMysql" }
    ];

    $scope.selectedAdapter = null;
    $scope.$watch('selectedAdapter', function() {
        for(var i=0; i<self.adapters.length; i++) {
            var adap = self.adapters[i];
            if(adap.label === $scope.selectedAdapter) {
                alert(adap.route);
                $location.path("/excelToMysql");
            }
        }
    });
}

let moduleName = angular
    .module('rootView', ['ngRoute'])
    .controller("rootViewCtrl", rootViewCtrl)
    .config(($routeProvider) => {
        $routeProvider.when(ROOT_PATH, {
            template: rootViewTemplate,
            controller: rootViewCtrl
        });
    })
    .name;

export default moduleName;
