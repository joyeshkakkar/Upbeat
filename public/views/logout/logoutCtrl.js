app.controller("LogoutController", function ($scope, $http, $rootScope) {
    $http.post("/api/logout");
    $scope.currentUser = null;
    $rootScope.currentUser = null;
    $scope.user = null;
});