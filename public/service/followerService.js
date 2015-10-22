app.factory('FollowerService', function FollowerService($http) {
    
    var followPlaylist = function (follower, callback) {
        $http.post("/api/follower", follower)
        .success(callback);
    }

    var unfollowPlaylist = function (follower, callback) {
        console.log(follower.followerUserId);
        $http.post("/api/unfollow", follower)
        .success(callback);
    }

    var followedPlaylist = function (userId, callback) {
        $http.get("/api/followedPlaylist/"+ userId)
        .success(callback);
    }

    var searchFollowersForPlaylist = function (playlistId, callback) {
        console.log("PlaylistId from followerService -->" + playlistId);
        $http.get("/api/searchFollowersForPlaylist/"+ playlistId)
        .success(callback);
    }
    
    return {
        followPlaylist: followPlaylist,
        followedPlaylist: followedPlaylist,
        unfollowPlaylist: unfollowPlaylist,
        searchFollowersForPlaylist: searchFollowersForPlaylist
    }
});