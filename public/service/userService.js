app.factory('UserService', function PlaylistService($http) {
    var searchUserByUserId = function (userId, callback) {
        $http.get("/api/user/" + userId)
        .success(callback);
    }

    var updateUser = function (currentUser, callback) {
        $http.put("/api/user/" + currentUser._id, currentUser)        
        .success(callback);
    }
    
    var addUser = function (user, callback) {
        $http.post("/api/user", user)
        .success(callback);
    }
        
    return {
        searchUserByUserId: searchUserByUserId,
        updateUser: updateUser,
        addUser: addUser
    }
});