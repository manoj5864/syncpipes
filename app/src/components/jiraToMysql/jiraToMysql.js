import angular from 'angular';
import ngRoute from 'angular-route';

import jiraToMysqlCtrl from 'components/jiraToMysql/jiraToMysqlCtrl';
import jiraToMysqlService from 'components/jiraToMysql/js/jiraToMysqlService'
import view from 'components/jiraToMysql/views/jiraToMysql.html!text';
const JIRA_TO_MYSQL_PATH = '/jiraToMysql';

let moduleName = angular
    .module("jiraToMysql", ['ngRoute'])
    .controller("jiraToMysqlCtrl", jiraToMysqlCtrl)
    .service("jiraToMysqlService", ['$http', '$q', jiraToMysqlService])
    .config(($routeProvider) => {
        $routeProvider.when( JIRA_TO_MYSQL_PATH, {
            template: view,
            controller: jiraToMysqlCtrl,
            css: 'components/jiraToMysql/css/jiraToMysql.css'
        });
    })
    .name;

export default moduleName;