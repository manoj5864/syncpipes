import angular from 'angular';
import "js-xlsx"
import "js-xlsx/dist/cpexcel"

function excelToMysqlCtrl($scope, dataFactory) {
    "use strict";

    $scope.$on('tabBroadcast', function() {
        $scope.activeTab = dataFactory.getActiveTab();
    });
}

export default excelToMysqlCtrl;