import angular from 'angular';
import ngRoute from 'angular-route';
import rootViewTemplate from 'views/rootView/rootView.html!text';
const ROOT_PATH = '/selectAdapter';

function rootViewCtrl($scope, $location) {
    "use strict";
    var self = this;

    self.adapters = [
        {from: "Excel", to: "MySQL", label:"exceltomysql", route: "/excelToMysql" },
        {from: "EA", to: "MySQL", label:"eatomysql", route: "/EAToMysql" },
        {from: "Jira", to: "MySQL", label: "jiratomysql", route: "/jiraToMysql" },
        {from: "Excel", to: "SocioCortex", label: "excelToSC", route: "/excelToSC" },
        {from: "MySQL", to: "SocioCortex", label: "mysqlToSC", route: "/mysqlToSC" }
    ];

    self.init = function() {
      toggleLink("connectionLink");
    };
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
