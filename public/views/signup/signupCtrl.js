app.controller("SignupController", function ($scope, $http, $rootScope, $location) {
    $scope.signup = function () {
        var usernameAlreadyExists = false;
        $http.get("/api/user")
                .success(function (response) {
                    $scope.users = response;
                    console.log(response);
                    for (var u in $scope.users) {
                        if ($scope.user.username == $scope.users[u].username) {
                            usernameAlreadyExists = true;
                            break;
                        }
                    }
                    if (usernameAlreadyExists) {
                        $scope.invalidUsername = usernameAlreadyExists;
                    }
                    else {
                        $http.post("/api/user", $scope.user)
                         .success(function (response) {
                             var user = { username: $scope.user.username, password: $scope.user.password };
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
                                 console.log(response);
                             });
                         })
                    }
                });
    }

    $scope.change = function (response) {
        $scope.invalidUsername = false;
    }
});
