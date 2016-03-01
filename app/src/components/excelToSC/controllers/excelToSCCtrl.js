function excelToSCCtrl($scope, excelSCDataFactory) {
    "use strict";
    var self = this;
    self.dataFactoryName = "excelSCDataFactory";

    $scope.$on('excelSCTabBroadcast', function() {
        $scope.activeTab = excelSCDataFactory.getExcelSCActiveTab();
    });
}

export default excelToSCCtrl;