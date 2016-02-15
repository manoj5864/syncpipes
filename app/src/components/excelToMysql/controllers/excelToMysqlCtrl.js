function excelToMysqlCtrl($scope, dataFactory) {
    "use strict";

    $scope.$on('tabBroadcast', function() {
        $scope.activeTab = dataFactory.getActiveTab();
    });
}

export default excelToMysqlCtrl;