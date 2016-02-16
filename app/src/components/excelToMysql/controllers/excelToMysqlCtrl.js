function excelToMysqlCtrl($scope, dataFactory) {
    "use strict";
    var self = this;
    self.dataFactoryParam = "excelToMysql";

    $scope.$on('tabBroadcast', function() {
        $scope.activeTab = dataFactory.getActiveTab();
    });
}

export default excelToMysqlCtrl;