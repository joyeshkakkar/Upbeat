app.controller("ContactController", function ($scope, $http, $rootScope) {
    $scope.currentUser = $rootScope.currentUser;
    var currentUser = $rootScope.currentUser;
    if (currentUser != null) {
        var sender = { username: currentUser.firstName + " " + currentUser.lastName , email: currentUser.email };
        $scope.sender = sender;
    }
    $scope.mailMe = function (sender) {
        $http.post("/api/sendMail", sender)
         .success(function (response) {
             console.log("mail sent");
             $scope.showMailSentMsg = "Your message is sent. Thanks!";
             $scope.sender = null;
         })
         .error(function (response) {
             console.log("mail not sent");             
         });
    }
});