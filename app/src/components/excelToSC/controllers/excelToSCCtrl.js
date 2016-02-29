function excelToSCCtrl($scope, dataFactory) {
    "use strict";
    $scope.dataFactoryName = "excelSCDataFactory";

    $scope.excel = dataFactory.getName();

    $scope.$on('tabBroadcast', function() {
        $scope.activeTab = dataFactory.getActiveTab();
    });
}

export default excelToSCCtrl;