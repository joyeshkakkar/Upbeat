app.controller("LoginController", function ($scope, $http, $rootScope, $location) {
    $scope.currentUser = null;
    $scope.invalid = false;
    $scope.login = function (user) {
        console.log(user);
        $http.post("/api/login", user)
         .success(function (response) {
             $rootScope.currentUser = response;
             $scope.currentUser = response;
             $scope.invalid = false;
             $location.url("/profile/");
         })
         .error(function (response) {
             console.log("username or password is incorrect");
             $scope.invalid = true;
             //console.log(response);
         });        
    }

    $scope.change = function (response) {
        $scope.invalid = false;
    }
});