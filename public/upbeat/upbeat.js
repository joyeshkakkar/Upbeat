var app = angular.module("UpbeatApp", ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
     when('/home', {
         templateUrl: 'views/search/search.html'
        , controller: 'SearchController'
         //templateUrl: 'views/home/home.html'
         //, controller: "HomeController"
     }).
    when('/login', {
        templateUrl: 'views/login/login.html'
        , controller: 'LoginController'
    }).
    when('/search', {
        templateUrl: 'views/search/search.html'
        , controller: 'SearchController'
    }).
     when('/about', {
         templateUrl: 'upbeat/about.html'
     }).
    when('/signup', {
        templateUrl: 'views/signup/signUp.html'
        , controller: 'SignupController'
    }).
    when('/playlist', {
        templateUrl: 'views/playlist/playlist.html'
        , controller: 'PlaylistController'
        , resolve: {
            loggedin: checkUserLoggedin
        }
    }).
    when('/logout', {
        //templateUrl: 'views/home/home.html'
        templateUrl: 'views/search/search.html'
        , controller: 'LogoutController'
    }).
    when('/contact', {
        templateUrl: 'views/contact/contact.html'
        , controller: 'ContactController'
    }).
    when('/profile', {
        templateUrl: 'views/profile/profile.html'
        , controller: 'ProfileController'
        , resolve: {
            loggedin: checkUserLoggedin
        }
    }).
     otherwise({
         redirectTo: '/home'
     });
}]);


var checkUserLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
    var deferred = $q.defer();
    $http.get('/api/loggedin').success(function (user) {
        $rootScope.errorMessage = null;
        //user is Authenticated
         console.log(user);
        if (user != '0') {
            console.log(user);
            console.log("user found");
            $rootScope.currentUser = user;
            deferred.resolve();
        } else {
            console.log("user not found");
            $rootScope.errorMessage = "you need to login";
            deferred.reject();
            $location.url("/login");
        }
    });
}